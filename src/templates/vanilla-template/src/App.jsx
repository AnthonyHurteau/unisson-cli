import { UnissonComponent } from "unisson";
import styles from "./app.module.css";

export default class App extends UnissonComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.title = "<%= projectTitle %>";
    this.render();
  }

  template() {
    return (
      <div>
        <div class={styles.appBar}>
          <img src="/unisson192.png" width="60" alt="AppBar logo" />
          <div>{this.title}</div>
        </div>
        <div class={styles.container}>
          <h1 class={styles.flexFull}>Welcome to {this.title}</h1>
          <div class={styles.flexFull}>
            <img src="/unisson192.png" alt="Unisson logo" />
          </div>
          <h2 class={styles.flexFull}>The Unisson Framework</h2>
          <div class={[styles.flex, styles.flexSmall, styles.gutter].join(" ")}>
            <h3>Design</h3>
            <p>
              Unisson is the French word for "unison" and it describes the design philosophy behind this project: making
              use of native browser features to compose an harmonious workflow.
            </p>
          </div>
          <div class={[styles.flex, styles.flexSmall, styles.gutter].join(" ")}>
            <h3>Core</h3>
            <p>
              Unisson is a featherweight Javascript framework that integrates JSX into the native modern browser
              standard of Web Components.
            </p>
          </div>
          <div class={[styles.flex, styles.flexSmall, styles.gutter].join(" ")}>
            <h3>Tangibility</h3>
            <p>
              No runtime dependencies and hardly any abstractions are included in order to give you as much liberty as
              possible to craft your website. 
            </p>
          </div>
          <h2 class={styles.flexFull}>Documentation</h2>
          <a class={styles.flex} href="https://www.npmjs.com/package/unisson" target="_blank" rel="noopener noreferrer">
            NPM
          </a>
          <br />
          <a
            class={styles.flex}
            href="https://github.com/AnthonyHurteau/unisson"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <br />
          <a class={styles.flex} href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">
            Vitejs
          </a>
        </div>
      </div>
    );
  }
}

customElements.define("app-main", App);
