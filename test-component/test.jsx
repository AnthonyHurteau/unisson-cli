import { UnissonComponent } from "unisson";
import css from "./test.module.css";

export default class Test extends UnissonComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {}

  disconnectedCallback() {}

  template() {
    return (
      <div>
        <p>Test component</p>
      </div>
    );
  }
}

customElements.define("test-element", Test);
