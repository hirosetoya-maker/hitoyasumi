# ひとやすみ HP — 運用ガイド

設計の経緯と判断は [DESIGN.md](DESIGN.md) を参照。

## ファイル構成

```
index.html      … ページ本体(文章の修正はここ)
css/style.css   … 見た目(色・余白・文字サイズ)
js/script.js    … 動き(フェードイン・追従ボタン・アクセス計測)
assets/img/     … 写真置き場
.nojekyll       … GitHub Pages用(削除しない)
```

## 公開前にやること(チェックリスト)

`index.html` 内の `TODO` コメントを検索すると、差し替えが必要な箇所がすべて見つかります。

1. **LINE友だち追加URL** — エディタで `lin.ee` を全文検索し、5箇所すべてを実URLに一括置換
   (LINE Official Account Manager →「友だち追加ガイド」でURLを取得)
2. **写真** — `assets/img/` の `placeholder-*.svg` を実写真に差し替え(下記手順)。
   ヒーロー用は暗め・横長の店内写真を推奨(文字が白のため)
3. **料金プラン** — **仮の金額が入っているので必ず実データに修正**
4. **トレーナー紹介** — 氏名・経歴(現在は仮の文章)
5. **お客様の声** — 仮の声を掲載中。掲載許可済みの実際の声に差し替え
6. **小岩駅からの徒歩分数** — アクセスの「徒歩◯分」を実測値に
7. **体験の所要時間** — 体験の流れセクション(現在は時間の記載なし)
8. **GA4測定ID** — `js/script.js` 冒頭の `GA_MEASUREMENT_ID` に設定(空のままなら計測なしで動作)
9. **OGP/canonical URL** — `index.html` の `<head>` 冒頭ブロック(公開URLが決まったら書き換え)
10. **JSON-LD** — 電話番号を埋めて `<head>` 内のコメントアウトを解除(住所・営業時間は記入済み)

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
