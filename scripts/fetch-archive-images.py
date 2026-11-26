#!/usr/bin/env python3
"""Download the archive images from Google Drive and save them at web size.

Reads site-src/archive/images.json ({ID: {drive_file_id, save_as}}) and writes each
image to its save_as path (site-src/assets/archive-<ID>.jpg): JPEG, at most 1,400 px
wide, quality 78, progressive, no metadata. Files that already exist are skipped, so
the script can be stopped and rerun. Then run `npm run build:site`.

Credentials, in this order:
  GDRIVE_SERVICE_ACCOUNT_JSON  the JSON key of a service account (the text itself or a
                               file path). Share the image folder with the account's
                               client_email as Viewer.
  GDRIVE_ACCESS_TOKEN          an OAuth access token with drive.readonly scope (lasts
                               about an hour).
  GDRIVE_API_KEY               a Google Cloud API key with the Drive API enabled. Works
                               only while the image folder is shared as "Anyone with
                               the link".
  neither                      requests go out unauthenticated, for an environment
                               whose proxy adds the credential to googleapis.com.

Usage: python3 scripts/fetch-archive-images.py [--only P0002,P0003] [--limit N]
       [--width 1400] [--quality 78] [--workers 6]
Needs Pillow (pip install pillow); service-account mode also needs cryptography.
"""
import argparse, base64, io, json, os, sys, threading, time, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(ROOT, "site-src/archive/images.json")
API = "https://www.googleapis.com/drive/v3/files/{}?alt=media&supportsAllDrives=true"
SCOPE = "https://www.googleapis.com/auth/drive.readonly"


class Token:
    def __init__(self):
        self.lock = threading.Lock()
        self.value, self.expires = None, 0
        raw = os.environ.get("GDRIVE_SERVICE_ACCOUNT_JSON", "").strip()
        if raw and not raw.startswith("{"):
            raw = open(raw).read()
        self.sa = json.loads(raw) if raw else None
        self.static = os.environ.get("GDRIVE_ACCESS_TOKEN", "").strip() or None
        self.api_key = os.environ.get("GDRIVE_API_KEY", "").strip() or None

    def url(self, file_id):
        u = API.format(file_id)
        return u + "&key=" + urllib.parse.quote(self.api_key) if self.api_key and not (self.sa or self.static) else u

    def header(self):
        if self.sa:
            with self.lock:
                if time.time() > self.expires - 120:
                    self.value, self.expires = self._service_account_token()
            return {"Authorization": f"Bearer {self.value}"}
        if self.static:
            return {"Authorization": f"Bearer {self.static}"}
        return {}

    def _service_account_token(self):
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding

        b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=")
        now = int(time.time())
        claims = {"iss": self.sa["client_email"], "scope": SCOPE, "aud": self.sa["token_uri"], "iat": now, "exp": now + 3600}
        signing_input = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b"." + b64(json.dumps(claims).encode())
        key = serialization.load_pem_private_key(self.sa["private_key"].encode(), password=None)
        jwt = signing_input + b"." + b64(key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256()))
        body = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt.decode()}).encode()
        with urllib.request.urlopen(urllib.request.Request(self.sa["token_uri"], data=body), timeout=30) as r:
            t = json.load(r)
        return t["access_token"], now + int(t.get("expires_in", 3600))


def download(token, file_id):
    for attempt in range(5):
        req = urllib.request.Request(token.url(file_id), headers=token.header())
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) or (e.code == 403 and b"rateLimit" in e.read()):
                time.sleep(2 ** attempt)
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            time.sleep(2 ** attempt)
    raise RuntimeError("gave up after 5 attempts")


def to_web(data, width, quality):
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    if im.mode != "RGB":
        im = im.convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    return out.getvalue(), im.size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--width", type=int, default=1400)
    ap.add_argument("--quality", type=int, default=78)
    ap.add_argument("--workers", type=int, default=6)
    a = ap.parse_args()

    items = json.load(open(MAP))
    if a.only:
        items = {k: items[k] for k in a.only.split(",")}
    todo = [(k, v) for k, v in items.items() if not os.path.exists(os.path.join(ROOT, v["save_as"]))]
    if a.limit:
        todo = todo[: a.limit]
    print(f"{len(items) - len(todo)} already saved, {len(todo)} to fetch")

    token, failed, total = Token(), [], 0

    def one(k, v):
        jpg, size = to_web(download(token, v["drive_file_id"]), a.width, a.quality)
        dest = os.path.join(ROOT, v["save_as"])
        with open(dest + ".part", "wb") as f:
            f.write(jpg)
        os.replace(dest + ".part", dest)
        return len(jpg), size

    with ThreadPoolExecutor(a.workers) as pool:
        futs = {pool.submit(one, k, v): k for k, v in todo}
        for n, fut in enumerate(as_completed(futs), 1):
            k = futs[fut]
            try:
                b, (w, h) = fut.result()
                total += b
                print(f"[{n}/{len(todo)}] {k} {w}x{h} {b // 1024} KB", flush=True)
            except Exception as e:  # keep going; report at the end
                failed.append((k, str(e)[:200]))
                print(f"[{n}/{len(todo)}] {k} FAILED: {str(e)[:200]}", flush=True)

    print(f"saved {len(todo) - len(failed)} files, {total / 1048576:.1f} MB")
    if failed:
        print(f"{len(failed)} failed:")
        for k, e in failed:
            print(f"  {k}: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
