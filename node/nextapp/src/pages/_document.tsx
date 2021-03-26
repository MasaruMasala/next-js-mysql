import Document, { DocumentContext } from "next/document";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

interface Props {}
export default class MyDocument extends NextDocument<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
