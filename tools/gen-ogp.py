# -*- coding: utf-8 -*-
# トップ/メソッド各ページの OGP 画像(1200x630)を生成する。
#   python3 tools/gen-ogp.py  → assets/img/ogp-*.png を上書き
# Chrome のヘッドレスでレンダリングして sips で 1200x630 に縮小。
# LINEのトーク内プレビューは og:image を中央で正方形トリミングするため、
# 主要要素はすべて中央 630x630 の内側(幅540px以内)に収める。
import os, subprocess, tempfile

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img")
TMP = tempfile.mkdtemp(prefix="ogp-")  # 中間ファイル(2x PNG・確認用の正方形クロップ)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PAGES = [
    dict(slug="home", label="恵比寿・小岩 パーソナルジム", num="",
         title="ひとやすみ", size=100,
         sub="仕事帰りに、<br>心と身体を整える"),
    dict(slug="online", label="ひとやすみ", num="",
         title="オンライン<br>パーソナル", size=92,
         sub="日々の生活まで、一緒に整えていく",
         bg="linear-gradient(170deg,#2F3A42,#242D33)", rule="#6D9FB5"),
    dict(slug="method", label="パーソナルジム ひとやすみ", num="",
         title="ひとやすみ<br>メソッド", size=100, sub="サポートの土台となる6つの考え方"),
    dict(slug="method-food", num="01", title="食事", size=152,
         sub="四毒抜きと和食中心の考え方"),
    dict(slug="method-exercise", num="02", title="運動", size=152,
         sub="外見と内面、両方のメリット"),
    dict(slug="method-rest", num="03", title="休養", size=152,
         sub="睡眠・呼吸・疲労管理の3視点"),
    dict(slug="method-posture", num="04", title="姿勢<br>日常動作", size=112,
         sub="呼吸・歩き方・座り方を整える"),
    dict(slug="method-mind", num="05", title="心の健康", size=118,
         sub="心の状態が、身体を変えていく"),
    dict(slug="method-habit", num="06", title="習慣化", size="136",
         sub="完璧を目指さない続け方"),
]

TPL = """<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  html,body{{width:1200px;height:630px}}
  body{{
    background:{bg};color:#F7F4EF;
    font-family:"ヒラギノ明朝 ProN","Hiragino Mincho ProN",serif;
    display:flex;align-items:center;justify-content:center;padding-bottom:78px;
    -webkit-font-smoothing:antialiased;
  }}
  .frame{{position:absolute;inset:34px;border:1px solid rgba(247,244,239,.20)}}
  .inner{{position:relative;width:560px;text-align:center}}
  .label{{font-size:27px;letter-spacing:.26em;text-indent:.26em;color:rgba(247,244,239,.70)}}
  .rule{{width:46px;height:1px;background:{rule};margin:22px auto 22px}}
  .num{{font-size:20px;letter-spacing:.34em;text-indent:.34em;
        color:rgba(247,244,239,.42);margin-bottom:14px}}
  .title{{font-size:{size}px;font-weight:600;line-height:1.16;
          letter-spacing:.10em;text-indent:.10em}}
  .sub{{margin-top:26px;font-size:25px;line-height:1.8;
        letter-spacing:.08em;text-indent:.08em;color:rgba(247,244,239,.74)}}
  .foot{{position:absolute;left:0;right:0;bottom:58px;text-align:center;
         font-size:19px;letter-spacing:.24em;text-indent:.24em;color:rgba(247,244,239,.40)}}
</style></head><body>
  <div class="frame"></div>
  <div class="inner">
    <div class="label">{label}</div>
    <div class="rule"></div>
    {num}
    <h1 class="title">{title}</h1>
    <p class="sub">{sub}</p>
  </div>
  <div class="foot">hitoyasumi.co.jp</div>
</body></html>"""

for p in PAGES:
    num = '<div class="num">%s / 06</div>' % p["num"] if p["num"] else ""
    doc = TPL.format(size=p["size"], label=p.get("label", "ひとやすみメソッド"),
                     num=num, title=p["title"], sub=p["sub"],
                     bg=p.get("bg", "#3A322C"), rule=p.get("rule", "#B4564A"))
    src = os.path.join(TMP, p["slug"] + ".html")
    png2x = os.path.join(TMP, p["slug"] + "@2x.png")
    open(src, "w").write(doc)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=2", "--window-size=1200,630",
                    "--virtual-time-budget=1200", "--screenshot=" + png2x,
                    "file://" + src], check=True, capture_output=True)
    dst = os.path.join(OUT, "ogp-" + p["slug"] + ".png")
    subprocess.run(["sips", "-z", "630", "1200", png2x, "--out", dst],
                   check=True, capture_output=True)
    # LINEのトーク内表示を確認するための中央正方形クロップ
    sq = os.path.join(TMP, "sq-" + p["slug"] + ".png")
    subprocess.run(["sips", "-c", "1260", "1260", png2x, "--out", sq],
                   check=True, capture_output=True)
    subprocess.run(["sips", "-z", "500", "500", sq, "--out", sq],
                   check=True, capture_output=True)
    print(dst, os.path.getsize(dst))
