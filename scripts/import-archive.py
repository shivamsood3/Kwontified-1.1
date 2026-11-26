#!/usr/bin/env python3
"""Turn the Kwontified Content Archive workbooks into article data for the site build.

  python3 scripts/import-archive.py <folder holding the nine .xlsx exports>

Reads the Blog, News and Press releases tabs, keeps rows whose Status starts with
"Final", and writes site-src/archive/:
  Post.json, PostNews.json, PostPressRelease.json   entries in the same shape as the
                                                    articles embedded in those templates
  index.json    one line per article for the Perspectives index
  images.json   article ID -> Google Drive file ID and the file name the build looks for
  report.txt    what was included, skipped and changed
scripts/build-site.mjs merges the entries; scripts/site-archive.mjs builds the index.
Needs: pip install openpyxl
"""
import sys, re, json, glob, os, html, datetime, collections
from urllib.parse import urlparse
from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site-src/archive")
SRC = sys.argv[1] if len(sys.argv) > 1 else "."
BASE = "https://kwontified.com"
FALLBACK = "assets/kq-archive-fallback.svg"
MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
TOPIC = {"AI commerce": "Agentic commerce"}
CTA = {
    "retail-media": ("See what your next ad dollar would return.", "Request an advertising review"),
    "dsp": ("See what your next ad dollar would return.", "Request an advertising review"),
    "measurement": ("See what your next ad dollar would return.", "Request an advertising review"),
    "agentic-commerce": ("Get your catalog ready for AI shopping assistants.", "Request an AI readiness review"),
    "revenue-recovery": ("Find where your marketplace margin leaks.", "Request a marketplace review"),
}
CTA_DEFAULT = ("Choose your next marketplace move with the data.", "Request a marketplace review")
AUTHOR = {"Jordan Taylor": ("AuthorJordan.html", "More from Jordan"), "Elaine Kwon": ("Author.html", "More from Elaine")}

S_LEAD = "margin: 0; font-size: clamp(21px, 1.8vw, 26px); line-height: 1.5"
S_P = "margin: 24px 0 0; line-height: 1.7"
S_H2 = "margin: 56px 0 0; font-weight: 400; font-size: clamp(26px, 2.2vw, 34px); line-height: 1.15; letter-spacing: -0.02em"
S_H3 = "margin: 40px 0 0; font-weight: 500; font-size: 22px; line-height: 1.3"
S_LIST = "margin: 24px 0 0; padding: 0 0 0 22px; display: flex; flex-direction: column; gap: 10px; line-height: 1.6"
S_TH = "text-align: left; padding: 12px 14px; font-weight: 500; border-bottom: 2px solid #102A4C"
S_TR = "text-align: left; padding: 12px 14px; font-weight: 500; border-bottom: 1px solid #C5CCD3"
S_TD = "padding: 12px 14px; border-bottom: 1px solid #C5CCD3"

report = collections.defaultdict(list)

def fdate(d): return f"{MON[d.month - 1]} {d.day}, {d.year}"
def todate(v):
    if isinstance(v, (datetime.datetime, datetime.date)): return datetime.date(v.year, v.month, v.day)
    if isinstance(v, (int, float)) or re.fullmatch(r"\d{5}(\.0)?", str(v).strip()):   # Excel serial date
        return datetime.date(1899, 12, 30) + datetime.timedelta(days=int(float(v)))
    return datetime.date.fromisoformat(str(v).strip()[:10])
def slugify(s):
    s = s.lower().replace("&", " and ").replace("’", "").replace("'", "")
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")
def smart(t):
    t = re.sub(r"(?<=\w)'(?=\w)", "’", t)
    t = re.sub(r'"([^"]*)"', r"“\1”", t)
    t = re.sub(r"(^|[\s(\[])'([^']*)'", r"\1‘\2’", t)
    return t.replace("'", "’").replace(" -- ", " — ")
def esc(t): return html.escape(smart(t), quote=False)

KNOWN = set()   # every route the finished site will have; filled before bodies are rendered
def link(text, url, pid):
    u = url.strip()
    internal = re.match(r"^(https?://(www\.)?kwontified\.com)?(/[^\s]*)?$", u)
    if internal:
        path = (internal.group(3) or "/").split("#")[0].split("?")[0].rstrip("/") or "/"
        if path not in KNOWN:
            report["links to pages that do not exist (link removed, text kept)"].append(f"{pid}: {u}")
            return text
        return f'<a href="{html.escape(path)}">{text}</a>'
    return f'<a href="{html.escape(u)}" target="_blank" rel="noopener">{text}</a>'
def inline(t, pid):
    out, pos = [], 0
    for m in re.finditer(r"\[([^\]]+)\]\(([^)\s]+)\)", t):
        out.append(fmt(t[pos:m.start()])); out.append(link(fmt(m.group(1)), m.group(2), pid)); pos = m.end()
    out.append(fmt(t[pos:]))
    return "".join(out)
def fmt(t):
    t = esc(t)
    t = re.sub(r"\*\*([^*]+)\*\*", r'<strong style="font-weight: 500">\1</strong>', t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", t)
    return re.sub(r"\b([\w.+-]+@kwontified\.com)\b", r'<a href="mailto:\1">\1</a>', t)

def md(body, pid, lead=True, plain_heads=()):
    lines = str(body).replace("\r", "").split("\n")
    while lines and not lines[0].strip(): lines.pop(0)
    if lines and lines[0].startswith("# "): lines.pop(0)
    out, i, first = [], 0, True
    def para(text):
        nonlocal first
        style = (S_LEAD if lead else "margin: 0; line-height: 1.7") if first else S_P
        first = False
        out.append(f'<p style="{style}">{inline(text, pid)}</p>')
    while i < len(lines):
        ln = lines[i].rstrip()
        if not ln.strip() or re.fullmatch(r"\s*(-{3,}|\*{3,}|#{3})\s*", ln): i += 1; continue
        if ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            rows = [r for r in rows if not all(re.fullmatch(r":?-{2,}:?", c or "-") for c in r)]
            if not rows: continue
            h = "".join(f'<th scope="col" style="{S_TH}">{inline(c, pid)}</th>' for c in rows[0])
            b = "".join("<tr>" + "".join((f'<th scope="row" style="{S_TR}">' if k == 0 else f'<td style="{S_TD}">') + inline(c, pid) + ("</th>" if k == 0 else "</td>") for k, c in enumerate(r)) + "</tr>" for r in rows[1:])
            out.append(f'<div style="margin: 32px 0 0; overflow-x: auto"><table style="width: 100%; min-width: 520px; border-collapse: collapse; font-size: 16px; line-height: 1.4"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>')
            first = False; continue
        m = re.match(r"^(#{2,4})\s+(.*)", ln)
        if m or ln.strip() in plain_heads:
            t = m.group(2) if m else ln.strip()
            out.append(f'<h{2 if not m or len(m.group(1)) == 2 else 3} style="{S_H2 if not m or len(m.group(1)) == 2 else S_H3}">{inline(t, pid)}</h{2 if not m or len(m.group(1)) == 2 else 3}>')
            first = False; i += 1; continue
        lm = re.match(r"^\s*([-*]|\d+[.)])\s+(.*)", ln)
        if lm:
            tag, items = ("ol" if lm.group(1)[0].isdigit() else "ul"), []
            while i < len(lines):
                l2 = lines[i].rstrip(); m2 = re.match(r"^\s*([-*]|\d+[.)])\s+(.*)", l2)
                if m2 and (m2.group(1)[0].isdigit()) == (tag == "ol"): items.append(m2.group(2)); i += 1
                elif l2.strip() and l2.startswith((" ", "\t")) and items: items[-1] += " " + l2.strip(); i += 1
                else: break
            out.append(f'<{tag} style="{S_LIST}">' + "".join(f"<li>{inline(x, pid)}</li>" for x in items) + f"</{tag}>")
            first = False; continue
        if ln.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"): buf.append(lines[i].lstrip("> ").strip()); i += 1
            out.append(f'<p style="{S_P}; font-style: italic">{inline(" ".join(buf), pid)}</p>'); first = False; continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#{2,4}\s|\||>|\s*([-*]|\d+[.)])\s)", lines[i]) and lines[i].strip() not in plain_heads:
            buf.append(lines[i].strip()); i += 1
        para(" ".join(buf))
    return "".join(out)

def text_of(h): return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()
# a full stop after one of these does not end a sentence ("U.S.", "4 p.m.", "South Dakota v. Wayfair", "Ga.")
ABBREV = re.compile(r"(?:\b(?:[A-Z]\.){2,}|\b(?:[ap]\.m|v|vs|e\.g|i\.e|etc|Inc|Ltd|Co|Corp|Mr|Ms|Mrs|Dr|St|No|Ga|Calif|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.)$")
DATELINE = re.compile(r"^.{0,200}?SANDY SPRINGS, Ga\.\s*[—–-]\s*[A-Z][a-z]+\.? \d{1,2}, \d{4}\s*[—–-]\s*", re.S)
def sentences(t):
    out, start = [], 0
    for m in re.finditer(r"[.!?]\s+(?=[A-Z0-9“\"‘(])", t):
        if ABBREV.search(t[start:m.start() + 1]): continue
        out.append(t[start:m.start() + 1].strip()); start = m.end()
    out.append(t[start:].strip())
    return [x for x in out if x]
def first_sentences(h, limit=155):
    """Meta description from body text: whole sentences up to the limit; press release datelines skipped;
    when the first sentence alone is too short or too long, the text is cut at a word boundary instead."""
    t = DATELINE.sub("", text_of(h)).strip(); s = ""
    # press releases all open with the same company descriptor; start with what this one announces
    m = re.match(r"Kwontified, an? [^,]+(?:, [^,]+)*?, today announced that (.)", t)
    if m: t = m.group(1).upper() + t[m.end():]
    for part in sentences(t):
        if len(s) + len(part) + 1 > limit: break
        s = (s + " " + part).strip()
    if len(s) < 70 and len(t) > len(s): s = t[:limit].rsplit(" ", 1)[0].rstrip(",;:—–- ") + "…"
    return s
def crumb(t): return t if len(t) <= 44 else t[:42].rsplit(" ", 1)[0].rstrip(",;:") + "…"

# ---- what the site already has -------------------------------------------------
existing_ids, existing_titles = set(), set()
for f in ("Post.html", "PostNews.html", "PostPressRelease.html"):
    m = re.search(r'<script type="application/json" id="kq-articles">(.*?)</script>', open(os.path.join(ROOT, "site-src/pages", f), encoding="utf8").read(), re.S)
    for k, a in json.loads(m.group(1)).items():
        existing_ids.add(k); KNOWN.add(a["canon"].replace(BASE, ""))
try:
    KNOWN.update(r["route"] for r in json.load(open(os.path.join(ROOT, "site-routes.json"))))
except Exception: pass

# ---- read the workbooks --------------------------------------------------------
TABS = {"Blog": ("Post.html", "Publish date", "Title", "Body (Markdown)"), "News": ("PostNews.html", "Publish date", "Headline", "Body"), "Press releases": ("PostPressRelease.html", "Release date", "Headline", "Body")}
items = []
for path in sorted(glob.glob(os.path.join(SRC, "*.xlsx"))):
    wb = load_workbook(path, read_only=True, data_only=True)
    for tab, (tpl, dcol, tcol, bcol) in TABS.items():
        if tab not in wb.sheetnames: continue
        it = wb[tab].iter_rows(values_only=True); hdr = [str(x) if x is not None else "" for x in next(it)]
        for r in it:
            if not r or not r[0]: continue
            row = dict(zip(hdr, r)); pid = str(row["ID"]).strip(); status = str(row.get("Status") or "")
            if pid in existing_ids: report["already on the site as a designed page (left as is)"].append(pid); continue
            if not status.startswith("Final"): report[f"skipped, status not Final ({tab})"].append(f"{pid}: {status[:60]}"); continue
            body = str(row[bcol] or "")
            body = re.sub(r"\n?\*?(If ever published: )?Written in 2026 using only sources available before[^\n]*\n?", "\n", body)
            if tab == "Press releases": body = body.replace("[NAME], [EMAIL]", "press@kwontified.com")
            ph = re.findall(r"\[(?:DATA NEEDED|NEEDS? [A-Z ]+|CITY|NAME|EMAIL|TBD|TK|PLACEHOLDER)[^\]]*\]", body)
            if ph: report["skipped, marked Final but still contains a placeholder"].append(f"{pid}: {ph[0]} x{len(ph)}"); continue
            items.append(dict(tab=tab, tpl=tpl, id=pid, date=todate(row[dcol]), title=str(row[tcol]).strip(), body=body, row=row))

# routes
seen = set(KNOWN)
for x in items:
    if x["tab"] == "Blog": route = str(x["row"]["Slug"]).strip()
    else: route = ("/perspectives/news/" if x["tab"] == "News" else "/perspectives/press-releases/") + slugify(x["title"])[:90].rstrip("-")
    if not route.startswith("/perspectives/"): route = "/perspectives/" + route.strip("/")
    if route in seen:
        new = f"{route}-{x['date'].year}"; n = 2
        while new in seen: new = f"{route}-{x['date'].year}-{n}"; n += 1
        report["address already in use, year added"].append(f"{x['id']}: {route} -> {new}"); route = new
    seen.add(route); x["route"] = route
KNOWN.update(x["route"] for x in items)

# ---- entries -------------------------------------------------------------------
entries = {"Post.html": {}, "PostNews.html": {}, "PostPressRelease.html": {}}
for x in items:
    r, pid, d = x["row"], x["id"], x["date"]
    topic = TOPIC.get(str(r.get("Topic") or "").strip(), str(r.get("Topic") or "").strip()); channel = str(r.get("Channel") or "").strip()
    x.update(topic=topic, channel=channel)
    e = dict(canon=BASE + x["route"], crumb=crumb(smart(x["title"])), title=html.escape(smart(x["title"]), quote=False), img=FALLBACK, alt="", id=pid)
    if x["tab"] == "Blog":
        author = str(r["Byline"]).strip(); ah, at = AUTHOR.get(author, ("Perspectives.html", "More articles"))
        e.update(ttag=smart(x["title"]) + " | Kwontified", desc=html.escape(smart(str(r["Meta description"] or "").strip())), kicker=f"Article. {topic}. {channel}",
                 byline=f'By <a href="{ah}" style="color: #102A4C">{author}</a>, Co-Founder and Managing Partner. Published {fdate(d)}.',
                 body=md(x["body"], pid), author=author, authhref=ah, authtext=at)
        e["closeh"], e["closebtn"] = CTA.get(str(r.get("CTA service") or "").strip(), CTA_DEFAULT)
        x.update(author=author, desc=text_of(e["desc"]), kind="Article")
    elif x["tab"] == "News":
        body = md(x["body"], pid); words = len(text_of(body).split()); desc = first_sentences(body)
        src = str(r.get("Primary source") or "").strip().split()[0] if r.get("Primary source") else ""
        g = f'<p style="margin: 10px 0 0; font-size: 16px; line-height: 1.5"><span style="font-weight: 500; color: #102A4C">Channel.</span> {html.escape(channel)}</p>'
        for label, val in (("Topic", html.escape(topic)), ("Published", fdate(d))):
            g += f'<p style="margin: 8px 0 0; font-size: 16px; line-height: 1.5"><span style="font-weight: 500; color: #102A4C">{label}.</span> {val}</p>'
        if src.startswith("http"):
            sd = ""
            try: sd = ", " + fdate(todate(r["Source date"]))
            except Exception: pass
            g += f'<p style="margin: 8px 0 0; font-size: 16px; line-height: 1.5"><span style="font-weight: 500; color: #102A4C">Primary source.</span> <a href="{html.escape(src)}" target="_blank" rel="noopener">{urlparse(src).netloc.replace("www.", "")}</a>{sd}</p>'
        e.update(ttag=smart(x["title"]) + " | Kwontified", desc=html.escape(desc), kicker=f"News. {topic}. {channel}",
                 byline=f'By <a href="Perspectives.html" style="color: #102A4C">Kwontified</a>. Published {fdate(d)}. {max(1, round(words / 220))}-minute read.',
                 body=body, author="Kwontified", authhref="Perspectives.html", authtext="More news", glance=g,
                 closeh="See what this news means for your account.", closebtn="Request a marketplace review")
        x.update(author="Kwontified", desc=desc, kind="News")
    else:
        body = md(x["body"], pid, lead=False, plain_heads=("About Kwontified", "Media contact"))
        e.update(ttag=smart(x["title"]), desc=html.escape(first_sentences(body)), kicker="Press release. For immediate release", byline=f"Sandy Springs, Georgia. {fdate(d)}.",
                 body=body, author="Kwontified", authhref="Contact.html", authtext="Contact Kwontified", glance="", closeh="Press and media inquiries.", closebtn="Contact Kwontified")
        x.update(author="Kwontified", desc="", kind="Press release", topic="", channel="")
    x["entry"] = e

# related: the three pieces of the same kind published just before (or after, for the oldest)
for tpl in entries:
    group = sorted((x for x in items if x["tpl"] == tpl), key=lambda x: (x["date"], x["id"]))
    for i, x in enumerate(group):
        near = (group[max(0, i - 3):i][::-1] + group[i + 1:i + 4])[:3]
        rel = ""
        for y in near:
            meta = ". ".join(v for v in ((y["topic"] or y["kind"]), (y["author"] if y["kind"] == "Article" else ""), fdate(y["date"])) if v)
            rel += f'<a href="{y["route"]}" data-archive-id="{y["id"]}" style="color: #262524; text-decoration: none; display: block"><p style="margin: 0; font-size: 15px; color: #626366">{html.escape(meta)}</p><h3 style="margin: 8px 0 0; font-weight: 500; font-size: 22px; line-height: 1.3">{y["entry"]["title"]}</h3></a>'
        x["entry"]["related"] = rel
        entries[tpl][x["id"]] = x["entry"]

os.makedirs(OUT, exist_ok=True)
for tpl, d in entries.items():
    json.dump(d, open(os.path.join(OUT, tpl.replace(".html", ".json")), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
index = [dict(id=x["id"], kind=x["kind"], date=x["date"].isoformat(), title=x["entry"]["title"], url=x["route"], topic=x["topic"], channel=x["channel"], author=x["author"], desc=html.escape(x["desc"])) for x in sorted(items, key=lambda x: (x["date"], x["id"]), reverse=True)]
json.dump(index, open(os.path.join(OUT, "index.json"), "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
images = {}
for x in items:
    m = re.search(r"/d/([A-Za-z0-9_-]{20,})", str(x["row"].get("Image URL") or ""))
    if m: images[x["id"]] = dict(drive_file_id=m.group(1), save_as=f"site-src/assets/archive-{x['id']}.jpg")
    else: report["no image link in the sheet"].append(x["id"])
json.dump(images, open(os.path.join(OUT, "images.json"), "w"), indent=0)
counts = collections.Counter(x["kind"] for x in items)
with open(os.path.join(OUT, "report.txt"), "w", encoding="utf8") as f:
    f.write(f"Imported: {counts['Article']} articles, {counts['News']} news items, {counts['Press release']} press releases ({len(items)} pages), {min(x['date'] for x in items)} to {max(x['date'] for x in items)}\nImages mapped: {len(images)}\n")
    for k, v in report.items(): f.write(f"\n{k}: {len(v)}\n" + "".join(f"  {s}\n" for s in v))
print(open(os.path.join(OUT, "report.txt"), encoding="utf8").read()[:2600])
