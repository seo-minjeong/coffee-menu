// step1 요구사항 구현을 위한 전략

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${
              item.soldOut ? "sold-out" : ""
            }"">${item.name}</span>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            > 
              품절
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
                수정
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
                삭제
            </button>
        </li>
      `;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  // 업데이트 메뉴
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  // 메뉴 추가
  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  // 메뉴 수정
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  // 메뉴 삭제
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  // 메뉴 품절
  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // 수정 / 삭제 / 품절
    // if문에서 뒷 부분을 체크 할 필요가 없을때 return을 해준다.
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // form 태그가 자동으로 전송되는걸 막음
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력받는건
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    // 카테고리 클릭 이벤트
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
