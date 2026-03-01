/* =========================
   環境変数
========================= */
const pagesPath = "pages";

// 初期ページ
const StartPage = "table_of_contents";
let currentPage = StartPage;

// ページ順
const pages = [
  { key: "table_of_contents", title: "目次" },
  { key: "article_reason", title: "この記事を書こうと思った経緯" },
  { key: "what_can", title: "何が出来る?" },
  { key: "steps", title: "じゃあ、実際の手順について" },
  { key: "troubleshooting", title: "公開出来なかった時の確認事項" },
  { key: "make_private", title: "非公開にする" },
  { key: "references", title: "参考" },
  { key: "notes", title: "注意事項" },
  { key: "other", title: "その他" },
  { key: "final", title: "最後に" },
];

// 用語集用のデータ
const glossary = {
  github: {
    name: "github",
    description:
      "ソースコードをオンラインで管理・共有できるサービス。バージョン管理(Git)を使って、変更履歴の保存や共同開発ができる。",
  },
  repository: {
    name: "repository",
    description:
      "ファイルやソースコードをまとめて保存する場所。プロジェクト単位の保管庫のようなもの。",
  },

  public_repository: {
    name: "public な repository",
    description:
      "誰でも閲覧できる公開設定のリポジトリ。オープンソースやポートフォリオ公開などに使われる。",
  },

  allow_key: {
    name: "allow key",
    description:
      "キーボードの矢印キー（↑ ↓ ← →）のこと。カーソルの移動や選択位置の変更、画面スクロールなどを行うためのキー。",
  },
  page_slide: {
    name: "ページ送り",
    description:
      "大量のデータを複数ページに分割して表示する仕組み。1ページごとに一定件数だけ表示すること。",
  },

  script: {
    name: "script",
    description:
      "特定の処理を実行するためのプログラム。比較的短く、単機能なコードを指すことが多い。",
  },

  js: {
    name: "js",
    description:
      "JavaScriptの略。Webブラウザ上で動作するプログラミング言語で、画面の動きやAPI通信などを制御できる。",
  },
  analytics: {
    name: "アナリティクス",
    description:
      "アクセス解析やデータ分析のこと。Webサイトの訪問者数や行動データを収集・分析する仕組み。",
  },

  affiliates: {
    name: "アフィリエイト",
    description:
      "成果報酬型の広告仕組み。紹介リンク経由で商品購入や登録が行われると報酬が発生する。",
  },

  deploy: {
    name: "デプロイ",
    description: "作成したアプリやWebサイトを本番環境に公開・反映すること。",
  },

  api_key: {
    name: "API Key",
    description:
      "外部サービスのAPIを利用する際に使う認証用のキー。利用者を識別し、アクセス制御を行うための文字列。",
  },

  issues: {
    name: "Issues",
    description:
      "バグ報告や機能要望、タスク管理を行うためのチケット機能。GitHubなどでプロジェクト管理に使われる。",
  },
};

const content = document.getElementById("content");
const progressBar = document.getElementById("progress-bar");

/* =========================
   初期URL読込
========================= */

function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("currentPage");

  if (page && pages.some((p) => p.key === page)) {
    currentPage = page;
  }
}

/* =========================
   URL更新
========================= */

function updateURL() {
  const newUrl = `?currentPage=${currentPage}`;
  history.pushState({ page: currentPage }, "", newUrl);
}

/* =========================
   ページ移動
========================= */

function movePage(direction) {
  const currentIndex = pages.findIndex((p) => p.key === currentPage);
  const nextIndex = currentIndex + direction;

  if (nextIndex < 0 || nextIndex >= pages.length) return;

  const nextPage = pages[nextIndex];
  animateSlide(direction, nextPage.key);
}

function goToPage(pageName) {
  if (!pages.some((p) => p.key === pageName)) return;

  const direction =
    pages.findIndex((p) => p.key === pageName) >
    pages.findIndex((p) => p.key === currentPage)
      ? 1
      : -1;

  animateSlide(direction, pageName);
}

/* =========================
   スライド演出
========================= */

function animateSlide(direction, nextPage) {
  content.classList.add(direction === 1 ? "slide-left" : "slide-right");

  setTimeout(() => {
    currentPage = nextPage;
    loadPage();
    content.classList.remove("slide-left", "slide-right");
  }, 200);
}

/* =========================
   ページ読込
========================= */

function loadPage() {
  fetch(`${pagesPath}/${currentPage}.html`)
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      updateProgress();
      updateURL();
      renderTOC("page-toc");
      renderTOC("toc-list");
      registerGlossaryEvents();
    })
    .catch((err) => {
      console.error("LOAD ERROR:", err);
      if (currentPage != StartPage) {
        currentPage = StartPage;
        loadPage();
      } else {
        content.innerHTML = "<h2>404</h2>";
      }
    });
}

/* =========================
   シークバー更新
========================= */

function updateProgress() {
  const index = pages.indexOf(currentPage);
  const percent = (index / (pages.length - 1)) * 100;
  progressBar.style.width = percent + "%";
}

/* =========================
   キーボード対応
========================= */

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") movePage(1);
  if (e.key === "ArrowLeft") movePage(-1);
});

document.addEventListener("keydown", (e) => {
  if (!e.ctrlKey) return;
  const match = e.code.match(/^(Digit|Numpad)([0-9])$/);
  if (!match) return;
  let num = Number(match[2]);
  const index = num;
  if (index < pages.length) {
    currentPage = pages[index];
    loadPage();
  }
});

/* =========================
   戻るボタン対応
========================= */

window.addEventListener("popstate", (event) => {
  if (event.state?.page) {
    currentPage = event.state.page;
    loadPage();
  }
});

/* =========================
   スワイプ対応
========================= */

let startX = 0;

content.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

content.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      movePage(1); // 左スワイプ
    } else {
      movePage(-1); // 右スワイプ
    }
  }
});

/* =========================
   初期化
========================= */

initFromURL();
loadPage();

/* =========================
   用語集
========================= */
const tooltip = document.getElementById("tooltip");

/* glossaryイベント再登録 */
function registerGlossaryEvents() {
  document.querySelectorAll(".glossary").forEach((el) => {
    const key = el.dataset.term;

    if (!glossary[key]) return;

    el.addEventListener("mouseenter", (e) => {
      tooltip.innerHTML = `<strong>${glossary[key].name}</strong><br>${glossary[key].description}`;

      tooltip.classList.add("show");
    });

    el.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY + 15 + "px";
    });

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
}

/* =========================
   用語集DOM取得
========================= */

const glossaryOverlay = document.getElementById("glossary-overlay");
const glossaryPanel = document.getElementById("glossary-panel");
const glossaryToggle = document.getElementById("glossary-toggle");
const glossaryBody = document.getElementById("glossary-body");

/* =========================
  テーブル生成
========================= */

function renderGlossary() {
  glossaryBody.innerHTML = "";

  Object.values(glossary).forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
    `;

    glossaryBody.appendChild(row);
  });
}

renderGlossary();

/* =========================
  開閉制御
========================= */
let isGlossaryOpen = false;
glossaryToggle.addEventListener("click", () => {
  if (isGlossaryOpen) {
    glossaryOverlay.classList.remove("open");
  } else {
    glossaryOverlay.classList.add("open");
  }
  isGlossaryOpen = !isGlossaryOpen;
});

/* 外側クリックで閉じる */
glossaryOverlay.addEventListener("click", (e) => {
  if (e.target === glossaryOverlay) {
    glossaryOverlay.classList.remove("open");
    isGlossaryOpen = false;
  }
});

/* =========================
  目次制御
========================= */

const tocOverlay = document.getElementById("toc-overlay");
const tocToggle = document.getElementById("toc-toggle");
let tocIsOpen = false;

tocToggle.addEventListener("click", () => {
  if (tocIsOpen) {
    tocOverlay.classList.remove("open");
  } else {
    tocOverlay.classList.add("open");
  }
  tocIsOpen = !tocIsOpen;
});

tocOverlay.addEventListener("click", (e) => {
  if (e.target === tocOverlay) {
    isGlossaryOpen = false;
    tocOverlay.classList.remove("open");
  }
});

function renderTOC(target) {
  const tocList = document.getElementById(target);
  if (!tocList) return;
  tocList.innerHTML = "";

  pages.forEach((page, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.innerHTML = `
          ${page.title}
        `;
    button.addEventListener("click", () => {
      currentPage = page.key;
      tocIsOpen = false;
      tocOverlay.classList.remove("open");
      loadPage();
    });
    li.appendChild(button);
    tocList.appendChild(li);
  });
}

