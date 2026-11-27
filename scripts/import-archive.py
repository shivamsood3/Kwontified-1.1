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

The helpers above main() (slugs, descriptions, press boilerplate, closing band) can be
imported without the workbooks, so a correction made to the JSON by hand or by a one-off
script follows exactly the rule a re-import applies.
"""
import sys, re, json, glob, os, html, datetime, collections
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site-src/archive")
SRC = sys.argv[1] if len(sys.argv) > 1 else "."
BASE = "https://kwontified.com"
# Addresses that changed after the first import are listed old -> new in site-src/archive/moved.json;
# next.config.ts reads that file and answers each old address with a permanent redirect.
MOVED = os.path.join(OUT, "moved.json")
# News and press addresses are the headline as a slug, cut at a whole word at or before this length.
SLUG_MAX = 90
# Short keyword addresses for pieces whose headline makes a long or awkward slug (by archive ID).
SLUGS = {
    "A0447": "kwontified-to-attend-amazon-accelerate-2023",
    "A0623": "kwontified-to-attend-amazon-accelerate-2024",
    "A0793": "kwontified-to-attend-amazon-accelerate-2025",
    "A0472": "kwontified-to-attend-amazon-ads-unboxed-2023",
    "A0638": "kwontified-to-attend-amazon-ads-unboxed-2024",
    "A0822": "kwontified-to-attend-amazon-ads-unboxed-2025",
    "P0309": "amazon-black-friday-deals-week-2019",
    "P0369": "amazon-limits-fba-inbound-shipments-to-high-demand-products",
    "P0458": "amazon-sets-prime-day-2020-for-october-13-14",
    "P0467": "early-read-prime-day-2020-panel-data-only",
    "P0479": "amazon-black-friday-deals-week-2020",
    "P0491": "early-read-cyber-week-2020-online-records",
    "A0116": "amazon-opens-registration-for-accelerate-2021",
}
# Closing band under every article and news item. The shared sentence is neutral; pieces about
# the holiday season or fourth-quarter planning keep the fourth-quarter wording ("closep").
CLOSE_P = "Tell us where you sell and what you want to grow. A member of our team will reply within one business day."
CLOSE_P_Q4 = "Tell us where you sell and what your fourth quarter looks like. A member of our team will reply within one business day."
HOLIDAY = re.compile(r"\bholiday|black friday|cyber (week|monday|five)|christmas|prime big deal days|prime early access|october prime|fourth quarter|peak season|gift returns", re.I)
Q4_PLAN = re.compile(r"\bq4\b.*\b(budget|deal|restock|seller fulfilled|shopper)|\b(budget|deal|restock|seller fulfilled|shopper)\b.*\bq4\b", re.I)
def is_q4(title):
    """Holiday season and fourth-quarter planning pieces (not quarterly results that happen to say Q4)."""
    t = html.unescape(title)
    return bool(HOLIDAY.search(t) or Q4_PLAN.search(t))
# Press boilerplate: what Kwontified is, in the words the rest of the site uses (About, Why Kwontified).
PRESS_OPEN = re.compile(r"Kwontified, an e-commerce channel management, marketing and technology services firm,")
PRESS_OPEN_NEW = "Kwontified, a marketplace management agency for consumer brands,"
PRESS_ABOUT = re.compile(r"Kwontified is an e-commerce channel management, marketing and technology services firm that helps brands plan, run and measure their business on (Amazon, Walmart(?:, Target)? and other marketplaces)\.")
def press_about(m):
    # releases from before Target Plus opened (2019) keep their own list of marketplaces
    where = "Amazon, Walmart, Target Plus and other marketplaces" if "Target" in m.group(1) else m.group(1)
    return f"Kwontified is a marketplace management agency that runs {where} for consumer brands. Founded in 2016, it is headquartered in Atlanta."
def press_boilerplate(t):
    return PRESS_ABOUT.sub(press_about, PRESS_OPEN.sub(PRESS_OPEN_NEW, t))
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
def headline_slug(title, pid=None):
    """News and press address: a short keyword slug where one is set, otherwise the headline cut at
    the last whole word that fits in SLUG_MAX characters (never inside a word or a year)."""
    if pid in SLUGS: return SLUGS[pid]
    s = slugify(html.unescape(title))
    if len(s) <= SLUG_MAX: return s
    cut = s[:SLUG_MAX + 1]
    return cut.rstrip("-") if cut.endswith("-") else cut.rsplit("-", 1)[0]
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

def text_of(h):
    # tags become spaces (so paragraphs do not run together), but never a space before punctuation:
    # "<a>press release</a>." reads "press release.", not "press release ."
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()
    return re.sub(r"\s+(?=[.,;:!?’”)])", "", t)
# headquarters city: Atlanta (Jordan, 2026-11-26); older sheets may still say Sandy Springs in datelines
# a full stop after one of these does not end a sentence ("U.S.", "4 p.m.", "South Dakota v. Wayfair", "Ga.", "Jacob K. Javits")
ABBREV = re.compile(r"(?:\b(?:[A-Z]\.){2,}|(?<![\w.])[A-Z]\.$|\b(?:[ap]\.m|v|vs|e\.g|i\.e|etc|Inc|Ltd|Co|Corp|Mr|Ms|Mrs|Dr|St|No|Ga|Calif|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.)$")
DATELINE = re.compile(r"^.{0,200}?(?:SANDY SPRINGS, Ga\.|ATLANTA)\s*[—–-]\s*[A-Z][a-z]+\.? \d{1,2}, \d{4}\s*[—–-]\s*", re.S)
def sentences(t):
    out, start = [], 0
    for m in re.finditer(r"[.!?]\s+(?=[A-Z0-9“\"‘(])", t):
        if ABBREV.search(t[start:m.start() + 1]): continue
        out.append(t[start:m.start() + 1].strip()); start = m.end()
    out.append(t[start:].strip())
    return [x for x in out if x]
DESC_MAX = 160
# where a news sentence names its source at the end ("..., CNBC reported on October 8.")
ATTRIBUTION = re.compile(r"(?:,| —)\s+(?:(?:according to|as reported by|as summarized by|citing)\s[^,.;:]+|(?:(?:the|its sister site)\s)?(?:[A-Z][\w’'&.-]*|news|agency)(?:\s(?:[A-Z][\w’'&.-]*|news|agency)){0,4}\s(?:reported|said|announced|found|wrote)(?:\s(?:on|in|from|citing|to|at|after)\s[^,.;:]*)?)\.$")
def first_sentences(h, limit=DESC_MAX):
    """Meta description from body text: whole sentences only, never cut mid-sentence and never
    ending in an ellipsis. Takes as many opening sentences as fit in the limit. When the first
    sentence alone is longer, its closing attribution (", CNBC reported on May 9.") is dropped,
    since the page names the source; a sentence still longer than the limit is kept whole rather
    than cut. Press release datelines are skipped."""
    t = DATELINE.sub("", text_of(h)).strip(); s = ""
    # press releases all open with the same company descriptor; start with what this one announces
    m = re.match(r"Kwontified, an? [^,]+(?:, [^,]+)*?, today announced (that )?(.)", t)
    if m and m.group(1): t = m.group(2).upper() + t[m.end():]
    elif m: t = "Kwontified today announced " + m.group(2) + t[m.end():]
    parts = sentences(t)
    for part in parts:
        if len(s) + len(part) + 1 > limit: break
        s = (s + " " + part).strip()
    if not s and parts:
        s = parts[0]
        short = ATTRIBUTION.sub(".", s)
        if len(short) >= 70 and short.count("“") == short.count("”"): s = short
    return s
def crumb(t): return t if len(t) <= 44 else t[:42].rsplit(" ", 1)[0].rstrip(",;:") + "…"

# US spellings (the site is in US English); quotations keep the speaker's spelling
US = {"cancelled": "canceled", "cancelling": "canceling", "fulfil": "fulfill", "fulfils": "fulfills", "fulfilment": "fulfillment",
      "ageing": "aging", "catalogue": "catalog", "catalogues": "catalogs", "travelled": "traveled", "travelling": "traveling",
      "colour": "color", "colours": "colors", "coloured": "colored", "colourful": "colorful", "grey": "gray", "jewellery": "jewelry"}
US_RE = re.compile(r"\b(" + "|".join(US) + r")\b", re.I)
def us(x): return US_RE.sub(lambda m: (US[m.group(1).lower()].capitalize() if m.group(1)[0].isupper() else US[m.group(1).lower()]), x)

def house(body):
    def node(m):
        t = m.group(1)
        parts = re.split(r"(“[^”]*”)", t)
        return ">" + "".join(x if x.startswith("“") else us(re.sub(r"(?<![\w-])ecommerce\b", "e-commerce", x).replace("A+ content", "A+ Content")) for x in parts) + "<"
    return re.sub(r">([^<>]+)<", node, ">" + body + "<")[1:-1]

def main():
    from openpyxl import load_workbook
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

    # routes. The addresses this import wrote last time are not "in use" (they are these items'
    # own), so a re-import gives every item the same address again.
    previous = {}
    for tpl in ("Post", "PostNews", "PostPressRelease"):
        path = os.path.join(OUT, tpl + ".json")
        if os.path.exists(path):
            for pid, e in json.load(open(path, encoding="utf8")).items(): previous[pid] = e["canon"].replace(BASE, "")
    seen = set(KNOWN) - set(previous.values())
    for x in items:
        if x["tab"] == "Blog": route = str(x["row"]["Slug"]).strip()
        else: route = ("/perspectives/news/" if x["tab"] == "News" else "/perspectives/press-releases/") + headline_slug(x["title"], x["id"])
        if not route.startswith("/perspectives/"): route = "/perspectives/" + route.strip("/")
        if route in seen:
            new = f"{route}-{x['date'].year}"; n = 2
            while new in seen: new = f"{route}-{x['date'].year}-{n}"; n += 1
            report["address already in use, year added"].append(f"{x['id']}: {route} -> {new}"); route = new
        seen.add(route); x["route"] = route
    KNOWN.update(x["route"] for x in items)
    # an address that changed since the last import keeps working: old -> new in moved.json
    moved = json.load(open(MOVED, encoding="utf8")) if os.path.exists(MOVED) else {}
    for x in items:
        old = previous.get(x["id"])
        if old and old != x["route"]:
            moved[old] = x["route"]; report["address changed (old address redirects, see moved.json)"].append(f"{x['id']}: {old} -> {x['route']}")
    in_use = (KNOWN - set(previous.values())) | {x["route"] for x in items}
    for old, new in list(moved.items()):
        if old == new or old in in_use: del moved[old]   # an address in use again is a page, not a redirect
        elif new in moved: moved[old] = moved[new]       # no redirect chains

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
            if is_q4(x["title"]): e["closep"] = CLOSE_P_Q4
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
            if is_q4(x["title"]): e["closep"] = CLOSE_P_Q4
            x.update(author="Kwontified", desc=desc, kind="News")
        else:
            # some sheets repeat the headline as the body's first line; the page already shows it as the H1
            raw = x["body"].replace("\r", "").lstrip("\n").split("\n")
            if raw and re.sub(r"^[#*\s]+|[*\s]+$", "", raw[0]) == x["title"].strip(): raw = raw[1:]
            body = md(press_boilerplate("\n".join(raw)), pid, lead=False, plain_heads=("About Kwontified", "Media contact"))
            e.update(ttag=smart(x["title"]), desc=html.escape(first_sentences(body)), kicker="Press release. For immediate release", byline=f"Atlanta, Georgia. {fdate(d)}.",
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
    # Work done on the JSON after an import must survive the next one:
    #   - image descriptions (the "alt" field), written by looking at each picture
    #   - copy edits in copy-edits.json: small wording fixes made in the site copy pass.
    #     Each one is {id, old, new}; "all": true replaces every occurrence. An edit whose
    #     old text is no longer in the sheet's version is listed in report.txt.
    # House spelling, applied to text only (never inside a tag, so links are untouched) and
    # never inside quotation marks: "e-commerce", Amazon's own "A+ Content" and US spellings.
    EDITS = os.path.join(OUT, "copy-edits.json")
    copy_edits = json.load(open(EDITS, encoding="utf8")) if os.path.exists(EDITS) else []
    for tpl, d in entries.items():
        path = os.path.join(OUT, tpl.replace(".html", ".json"))
        before = json.load(open(path, encoding="utf8")) if os.path.exists(path) else {}
        for pid, e in d.items():
            if not e.get("alt") and before.get(pid, {}).get("alt"): e["alt"] = before[pid]["alt"]
            # a shorter <title> for search results where the headline runs past 65 characters
            # (the H1 and og:title keep the headline; scripts/site-archive.mjs applies it)
            if before.get(pid, {}).get("seo_title"): e["seo_title"] = before[pid]["seo_title"]
        for ed in copy_edits:
            e = d.get(ed["id"])
            if e is None: continue
            if ed["old"] in e["body"]: e["body"] = e["body"].replace(ed["old"], ed["new"]) if ed.get("all") else e["body"].replace(ed["old"], ed["new"], 1)
            elif ed["new"] and ed["new"] in e["body"]: pass  # the sheet already has the new wording
            else: report["copy edit not applied (the sheet's text has changed)"].append(f"{ed['id']}: {ed['old'][:60]}")
        for e in d.values():
            for k in ("body", "related", "title", "ttag", "crumb", "desc"):
                if e.get(k): e[k] = house(e[k])
    for x in items: x["desc"] = house(x["desc"])
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
    json.dump(dict(sorted(moved.items())), open(MOVED, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    counts = collections.Counter(x["kind"] for x in items)
    with open(os.path.join(OUT, "report.txt"), "w", encoding="utf8") as f:
        f.write(f"Imported: {counts['Article']} articles, {counts['News']} news items, {counts['Press release']} press releases ({len(items)} pages), {min(x['date'] for x in items)} to {max(x['date'] for x in items)}\nImages mapped: {len(images)}\n")
        for k, v in report.items(): f.write(f"\n{k}: {len(v)}\n" + "".join(f"  {s}\n" for s in v))
    print(open(os.path.join(OUT, "report.txt"), encoding="utf8").read()[:2600])

if __name__ == "__main__":
    main()
