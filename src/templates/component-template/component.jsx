import { UnissonComponent } from "unisson";
import styles from "./<%= name %>.module.css";

export default class <%= className %> extends UnissonComponent {
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
        <p><%= className %> component</p>
      </div>
    );
  }
}

customElements.define("<%= name %>-element", <%= className %>);
