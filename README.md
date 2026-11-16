# yakitori-major.com

焼鶏 メジャー（錦糸町）の公式サイトです。既存の WordPress サイトの文章・写真をもとに、
GitHub Pages で公開できる静的 HTML/CSS/JS サイトとして作り直しています。

## 構成

```
index.html                 トップ（ヒーロー / こだわり / お品書き / 席・空間 / Instagram / お知らせ / 店舗情報）
concept/index.html         こだわり
course/index.html          コース（焼鶏おまかせコース）
table/index.html           席・空間
sister-store/index.html    姉妹店紹介
media/index.html           メディア掲載実績
information/index.html     お知らせ一覧（各記事は #post-<ID> のアンカー付きで本文を掲載）
privacy/index.html         個人情報保護方針
privacy_policy/index.html  旧 URL からの転送（meta refresh → /privacy/）
css/style.css              スタイル（黒基調・金のアクセント・白木のヘッダー）
js/main.js                 ハンバーガーメニュー / 現在ページのナビ強調
images/                    ロゴ・写真（既存サイトから取得、半角英数字にリネーム）
site.config.json           店名・住所・電話・営業時間などのサイト情報
CNAME                      GitHub Pages の独自ドメイン設定（yakitori-major.com）
```

- 各ページは `<html lang="ja">` / viewport / title / description / OGP を持ちます。
- リンクと画像パスはルート相対（`/concept/`, `/images/...`）です。独自ドメイン直下で公開する前提です。
- 外部リソースは Google Fonts（Noto Sans JP / Noto Serif JP）と Google マップの埋め込みのみ。
- 予約は TableCheck（`site.config.json` の `reservation_url`）、採用情報は Pay it Forward コーポレートサイトへリンクしています。
- ヘッダー・フッター・店舗情報ブロックは全ページ共通です。編集するときは全ページ同じ内容に揃えてください。

## ローカルで確認

```bash
python -m http.server 8000
```

ブラウザで http://localhost:8000/ を開きます（ルート相対パスのためリポジトリ直下で起動してください）。

## 公開までの流れ

1. GitHub にこのリポジトリを push する
2. Settings → Pages で `main` ブランチ / ルートを公開元に設定する
3. ドメイン管理側で DNS を GitHub Pages に向ける（A レコード 4 件 + www の CNAME）
4. Pages 設定で "Enforce HTTPS" を有効にする

## 評価表示（トップページの Google / 食べログ）

- 表示データは `data/ratings.json`。トップページの `js/ratings.js` が読み込んで評価帯（`#ratings`）に表示する。
- **Google**: `.github/workflows/update-ratings.yml` が毎日 03:00（JST）に `scripts/update_google_rating.py` を実行し、Places API から点数・口コミ件数を取得して `data/ratings.json` を更新・コミットする。リポジトリの Secrets に `GOOGLE_MAPS_API_KEY` が必要。初回実行時に `google.query` で店舗を検索して `place_id` を保存する（`matched_name` / `matched_address` で正しい店舗か確認する）。
- **食べログ**: 自動取得は利用規約上できないため手入力。`tabelog.score` / `tabelog.count` / `tabelog.asof` を店舗ページを見て月 1 回程度更新する。
- 点数が未取得（null）の間は、その項目は表示されない。

## Cloudflare へのデプロイ

- `main` に push すると `.github/workflows/deploy-cloudflare.yml` が Cloudflare Workers（静的アセット）へデプロイする（Worker 名 `yakitori-major`）。毎日 03:30 JST にも実行され、評価データの更新を反映する。
- リポジトリの Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要。
- `scripts/cloudflare_config.py` が Cloudflare 上のゾーンの状態を見て、ネームサーバー切替済み（active）なら独自ドメインと www を Custom Domain として自動で付ける。切替前は workers.dev の URL のみ。
- 設定本体は `wrangler.json`。デプロイ時に `_site/`（公開ファイルだけを集めたもの）と `wrangler.deploy.json` が生成されるが、どちらも git 管理外。
