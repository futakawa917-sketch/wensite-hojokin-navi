export const siteConfig = {
  // === 基本情報 ===
  clientId: "hojokin-navi",
  name: "補助金申請ナビ",
  description: "事業再構築・IT導入・小規模事業者持続化など、あらゆる補助金の申請をプロがサポート。無料診断で受給可能性をチェック。",
  url: "https://hojokin-support.net",

  // === 画像 ===
  heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
  staffImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  worriesImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",

  // === お客様の声 ===
  testimonials: [
    {
      name: "K.T様",
      age: "40代",
      area: "東京都",
      photo: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80",
      property: "事業再構築補助金",
      text: "自分では到底書けない申請書を、丁寧にヒアリングしながら完成させてもらいました。採択率が高い理由がわかりました。本当に助かりました。",
    },
    {
      name: "S.M様",
      age: "50代",
      area: "大阪府",
      photo: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=200&q=80",
      property: "IT導入補助金",
      text: "ITツールの選定から補助金申請まで一括で対応してもらえて、社内のDXが一気に進みました。費用の3分の2が補助されて感謝しています。",
    },
    {
      name: "A.H様",
      age: "30代",
      area: "愛知県",
      photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80",
      property: "小規模事業者持続化補助金",
      text: "開業したばかりで補助金の存在すら知りませんでした。無料診断がきっかけで50万円の補助金を受給できました。",
    },
  ],

  // === テーマカラー ===
  colors: {
    primary: "#0a1f3d",
    primaryHover: "#061529",
    accent: "#c8102e",
    accentHover: "#a50d24",
    bg: "#f5f2eb",
    bgWhite: "#ffffff",
  },

  // === トップページ ===
  hero: {
    title: "その事業、\n補助金で実現できます。",
    subtitle: "事業再構築・IT導入・持続化補助金など、あなたの事業に使える補助金をプロが無料診断。採択率90%超の実績。",
    ctaText: "無料で補助金診断",
  },

  // === 信頼要素 ===
  trustPoints: [
    { icon: "◉", title: "採択率90%超", description: "豊富な採択実績に基づく申請書作成" },
    { icon: "◉", title: "完全成功報酬", description: "採択されなければ費用はいただきません" },
    { icon: "◉", title: "全業種対応", description: "飲食・製造・IT・サービス業など幅広く" },
    { icon: "◉", title: "申請〜受給まで一貫", description: "面倒な手続きを全てお任せ" },
  ],

  // === CTA ===
  cta: {
    phone: "090-2169-2424",
    lineUrl: "https://lin.ee/RQYNh94",
    lineId: "@snshack",
    email: "info@snshack.co.jp",
  },

  // === お問い合わせフォーム ===
  contactForm: {
    title: "無料補助金診断・ご相談",
    fields: [
      { name: "name", label: "お名前", type: "text", required: true },
      { name: "phone", label: "電話番号", type: "tel", required: true },
      { name: "email", label: "メールアドレス", type: "email", required: false },
      { name: "propertyType", label: "ご検討中の補助金", type: "select", required: true,
        options: ["事業再構築補助金", "IT導入補助金", "小規模事業者持続化補助金", "ものづくり補助金", "その他・わからない"] },
      { name: "area", label: "事業所所在地", type: "text", required: true },
      { name: "message", label: "事業内容・ご相談内容", type: "textarea", required: false },
    ],
  },

  // === 記事自動生成 ===
  articles: {
    topicsPool: [
      // === 補助金の種類（検索意図: Know） ===
      "事業再構築補助金とは？対象者・補助額・申請方法を徹底解説【2026年版】",
      "IT導入補助金の活用ガイド｜対象ツール・申請手順・採択のコツ",
      "小規模事業者持続化補助金の申請方法｜採択率を上げる5つのポイント",
      "ものづくり補助金とは？製造業以外でも使える活用事例",
      "創業補助金・開業時に使える支援制度まとめ【2026年最新】",
      // === 申請ノウハウ（検索意図: Do） ===
      "補助金の申請書の書き方｜審査員に選ばれる事業計画のコツ",
      "補助金申請で不採択になる7つの理由と対策",
      "補助金の採択率を上げる方法｜プロが教える5つの戦略",
      "補助金申請に必要な書類一覧｜チェックリスト付き",
      "GビズIDの取得方法｜補助金申請に必須のアカウント登録手順",
      // === 業種別（検索意図: Do） ===
      "飲食店が使える補助金一覧｜開業・改装・DX化まで",
      "美容室・サロンが活用できる補助金｜設備導入・集客に",
      "製造業向け補助金まとめ｜設備投資・DX・海外展開",
      "EC・ネットショップ開設に使える補助金｜IT導入補助金の活用法",
      "建設業が申請できる補助金一覧｜DX・安全対策・人材育成",
      // === 比較・選び方（検索意図: Compare） ===
      "補助金と助成金の違い｜どちらを申請すべき？",
      "補助金申請は自分でやる vs 専門家に依頼｜メリット・デメリット比較",
      "補助金コンサルの選び方｜悪質業者を見抜く5つのチェックポイント",
      // === 税金・経理（検索意図: Know） ===
      "補助金を受け取ったら税金はかかる？確定申告の注意点",
      "補助金の会計処理｜仕訳・勘定科目・圧縮記帳を解説",
      "補助金の交付申請から入金までの流れ｜実績報告のポイント",
      // === トレンド・制度変更 ===
      "2026年度の補助金スケジュール｜主要補助金の公募時期まとめ",
      "事業再構築補助金の最新変更点｜2026年度の注意事項",
      "省力化投資補助金とは？2026年の新制度を解説",
      // === 初心者向け ===
      "補助金とは？初めての方向け基礎知識ガイド",
      "補助金申請の流れ｜初心者でもわかる7ステップ",
      "個人事業主が使える補助金・助成金まとめ【2026年版】",
      "補助金の審査基準とは？採択される事業計画書の特徴",
      "補助金申請でよくある質問20選｜プロが回答",
      "補助金が不採択だった場合の再申請戦略",
    ],
    wordsPerArticle: 3000,
    seo: {
      targetKeywords: ["補助金", "補助金 申請", "事業再構築補助金", "IT導入補助金", "小規模事業者持続化補助金"],
      internalLinkCta: "無料補助金診断はこちら",
      ctaUrl: "/contact",
    },
  },

  // === トピッククラスタ ===
  topicCluster: {
    pillar: { slug: "", title: "" },
    clusters: [],
  },

  // === 選ばれる理由 ===
  reasons: [
    {
      number: "01",
      title: "採択率90%超の実績",
      description: "年間200件以上の申請サポート実績。業界トップクラスの採択率で、お客様の事業計画を確実に形にします。",
    },
    {
      number: "02",
      title: "完全成功報酬制",
      description: "採択されなければ費用は一切いただきません。初期費用0円でリスクなく補助金申請に挑戦できます。",
    },
    {
      number: "03",
      title: "全業種・全補助金に対応",
      description: "飲食・製造・IT・サービス業など業種を問わず対応。事業再構築・IT導入・持続化補助金など主要な補助金を網羅しています。",
    },
    {
      number: "04",
      title: "申請書作成〜受給まで一貫サポート",
      description: "事業計画書の作成から交付申請、実績報告まで一気通貫で対応。面倒な書類作成や手続きはすべてお任せください。",
    },
    {
      number: "05",
      title: "無料診断で受給可能性がわかる",
      description: "AI診断とプロの目で、あなたの事業にどの補助金がいくら使えるかを無料で診断。まずは気軽にお試しください。",
    },
  ],

  // === 対象 ===
  targetProperties: [
    "新規事業を始めたい方",
    "設備投資を検討中の方",
    "ITツール・DXを導入したい方",
    "店舗の改装・リニューアル",
    "EC・ネット販売を始めたい方",
    "海外展開を計画中の方",
    "人材育成・研修を強化したい方",
    "省エネ・脱炭素に取り組みたい方",
  ],

  // === FAQ ===
  faq: [
    {
      question: "補助金の申請は初めてですが大丈夫ですか？",
      answer: "もちろん大丈夫です。初めての方こそ専門家のサポートが効果的です。事業内容をヒアリングし、最適な補助金の選定から申請書作成まで丁寧にサポートします。",
    },
    {
      question: "費用はいくらかかりますか？",
      answer: "相談・診断は完全無料です。申請サポートの費用は完全成功報酬制で、採択されなければ費用は一切かかりません。採択された場合のみ、補助金額に応じた報酬をいただきます。",
    },
    {
      question: "どの補助金が自分の事業に使えるかわかりません",
      answer: "無料診断で最適な補助金をお調べします。AI診断なら30秒で候補がわかります。詳しくはお電話やフォームからご相談ください。",
    },
    {
      question: "申請から採択までどのくらいかかりますか？",
      answer: "補助金の種類によりますが、申請書作成に2〜4週間、審査に1〜3ヶ月が一般的です。公募期間に間に合うよう、早めのご相談をおすすめします。",
    },
    {
      question: "個人事業主でも補助金は使えますか？",
      answer: "はい、個人事業主の方も多くの補助金を活用できます。小規模事業者持続化補助金やIT導入補助金は個人事業主の採択実績も豊富です。",
    },
    {
      question: "過去に不採択になったことがありますが再申請できますか？",
      answer: "再申請は可能です。過去の不採択理由を分析し、事業計画を改善したうえで再チャレンジすることで採択率を高められます。",
    },
    {
      question: "補助金を受け取った後に返還することはありますか？",
      answer: "補助金の目的外使用や、事業を途中で中止した場合は返還を求められることがあります。適切な使途管理と実績報告のサポートも行いますのでご安心ください。",
    },
    {
      question: "オンラインでの対応は可能ですか？",
      answer: "はい、全国対応しています。Zoom等でのオンライン面談、メール・LINEでのやり取りで申請完了まで進められます。",
    },
  ],

  // === 実績 ===
  results: [
    {
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
      type: "事業再構築補助金",
      area: "東京都・飲食業",
      size: "新業態への転換",
      price: "1,500万円",
      period: "3ヶ月",
    },
    {
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
      type: "IT導入補助金",
      area: "大阪府・製造業",
      size: "生産管理システム導入",
      price: "350万円",
      period: "2ヶ月",
    },
    {
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
      type: "持続化補助金",
      area: "愛知県・美容室",
      size: "HP制作・集客強化",
      price: "50万円",
      period: "1.5ヶ月",
    },
    {
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
      type: "ものづくり補助金",
      area: "福岡県・製造業",
      size: "新製品開発・設備導入",
      price: "1,000万円",
      period: "4ヶ月",
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      type: "IT導入補助金",
      area: "北海道・小売業",
      size: "ECサイト構築",
      price: "200万円",
      period: "2ヶ月",
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      type: "事業再構築補助金",
      area: "神奈川県・サービス業",
      size: "オンラインサービス開発",
      price: "800万円",
      period: "3ヶ月",
    },
  ],

  // === サービスの流れ ===
  steps: [
    { number: "01", title: "無料相談", description: "お電話・LINE・フォームからお気軽にご相談ください" },
    { number: "02", title: "補助金診断", description: "事業内容をヒアリングし、最適な補助金と受給額を診断" },
    { number: "03", title: "申請書作成", description: "採択率の高い事業計画書をプロが作成します" },
    { number: "04", title: "採択・受給", description: "採択後の交付申請・実績報告までサポート" },
  ],

  // === ナビゲーション ===
  nav: [
    { label: "ホーム", href: "/" },
    { label: "LINE無料診断", href: "https://lin.ee/RQYNh94" },
    { label: "コラム", href: "/articles" },
    { label: "無料相談", href: "/contact" },
  ],

  // === フッター ===
  footer: {
    companyName: "株式会社SNS HACK",
    address: "東京都豊島区東池袋3-1-1 サンシャイン60 12F",
  },

  // === 会社情報（E-E-A-T用） ===
  company: {
    name: "株式会社SNS HACK",
    representative: "代表取締役 二川 凌",
    established: "",
    capital: "",
    address: "〒170-6012 東京都豊島区東池袋3-1-1 サンシャイン60 12F",
    phone: "090-2169-2424",
    email: "info@snshack.co.jp",
    license: "",
    business: "補助金申請サポート、Webマーケティング支援、SNS運用代行",
    privacyPolicyUpdated: "2026-04-16",
    lawUpdated: "2026-04-16",
  },
} as const;

export type SiteConfig = typeof siteConfig;
