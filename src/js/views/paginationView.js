import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log('page', this._data.page, ';numPages', numPages);
    //page 1 and there are other pages
    if (this._data.page == 1 && numPages > 1) {
      console.log('first page');
      return this._generateMarkupNext();
    }

    //last page
    if (this._data.page == numPages && numPages > 1) {
      console.log('last page');
      return this._generateMarkupBack();
    }
    //other pages
    if (this._data.page < numPages) {
      return `${this._generateMarkupBack()} ${this._generateMarkupNext()}`;
    }
    //page 1 and there are no another pages
    return '';
  }
  _generateMarkupBack() {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        +this._data.page - 1
      }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${+this._data.page - 1}</span>
    </button>`;
  }
  _generateMarkupNext() {
    return `
    <button class="btn--inline pagination__btn--next" data-goto="${
      +this._data.page + 1
    }">
          <span>Page ${+this._data.page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
