# ひとやすみ HP — 運用ガイド

設計の経緯と判断は [DESIGN.md](DESIGN.md) を参照。

## ファイル構成

```
index.html          … トップページ(文章の修正はここ)
method.html         … ひとやすみメソッド ハブページ
method-food.html    … メソッド01 食事
method-exercise.html… メソッド02 運動
method-rest.html    … メソッド03 休養
method-posture.html … メソッド04 姿勢・日常動作
method-mind.html    … メソッド05 心の健康
method-habit.html   … メソッド06 習慣化
css/style.css       … 見た目(色・余白・文字サイズ)
js/script.js        … 動き(フェードイン・追従ボタン・ハンバーガーナビ・目次・アクセス計測)
assets/img/         … 写真置き場
.nojekyll           … GitHub Pages用(削除しない)
```

## 公開前にやること(チェックリスト)

`index.html` 内の `TODO` コメントを検索すると、差し替えが必要な箇所がすべて見つかります。

1. **お客様の声** — 仮の声を掲載中。掲載許可済みの実際の声に差し替え
2. **お客様インタビュー動画** — 現在Coming Soonのプレースホルダー。動画が用意でき次第、埋め込みタグに差し替え
3. **体験の所要時間** — 体験の流れセクション(現在は時間の記載なし)
4. **GA4測定ID** — `js/script.js` の `GA_MEASUREMENT_ID` に設定(空のままなら計測なしで動作)
5. **favicon / apple-touch-icon** — 暫定のデータURI faviconを正式版に差し替え
6. **「気づけば、身体も変わっている」カードの写真** — 現在は恵比寿店内装を流用。シーン写真が用意できたら差し替え
7. **メソッド各記事の解説動画** — 6記事すべて現在Coming Soonのプレースホルダー。動画が用意でき次第、埋め込みタグに差し替え

※ OGP画像(1200×630)はトップ+メソッド7ページ分を制作済み(2026-09-15)。`assets/img/ogp-*.png`。文言やサイズを変えるときは `tools/gen-ogp.py` の `PAGES` を編集して `python3 tools/gen-ogp.py` で再生成する
※ 絶対URL(canonical / og:url / JSON-LD)は本番ドメイン https://hitoyasumi.co.jp/ に統一済み(2026-09-15)

※ 料金プラン(定額+回数券)・2店舗の住所・徒歩分数(各5分)・予約変更/シャワーFAQ・JSON-LDは実データ反映済み(2026-07-02)
※ LINE友だち追加URLは反映済み(2026-07-11、5箇所とも https://lin.ee/uh5e5la )
※ ひとやすみメソッド(method.html + 記事6本)を追加(2026-08-12)。各記事の医学的・科学的主張には出典を明記し、断定を避けたヘッジ表現で統一。事実関係の見直しが必要な場合は各記事末尾の「参考文献」を参照

## 写真の差し替え手順

1. [Squoosh](https://squoosh.app/) で写真を開く
2. リサイズ: 幅 **1200px**(ヒーロー背景は 1600px、トレーナー写真は 480px 正方形)
3. 形式: **WebP**、容量 **200KB以下** を目安に書き出し
4. `assets/img/` に保存し、`index.html` 内の該当 `src` をファイル名に合わせて変更

## 公開・更新手順(GitHub Pages)

初回:

```
git init && git add -A && git commit -m "初回公開"
gh repo create hitoyasumi --public --source=. --push
```

GitHubのリポジトリ → Settings → Pages → Branch を `main` に設定。

更新(文章修正など):

```
git add -A && git commit -m "修正内容" && git push
```

数分で反映されます。

## 独自ドメイン移行時

`index.html` の `<head>` にある「絶対URLはここに集約」ブロックのURLだけ書き換え、
GitHub Pages の Custom domain を設定する。
