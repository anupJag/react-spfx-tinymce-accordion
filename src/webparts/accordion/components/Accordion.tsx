import * as React from 'react';
import styles from './Accordion.module.scss';
import { IAccordionProps } from './IAccordionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ReactHtmlParser from 'react-html-parser';
import * as TinyMCE from 'tinymce';
require('tinymce/themes/modern/theme');
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/advlist';
import { Editor } from '@tinymce/tinymce-react';

export default class Accordion extends React.Component<IAccordionProps, {}> {

  constructor(props: IAccordionProps) {
    super(props);
    TinyMCE.init({});
  }

  protected clicked = (event) => {
    let currentElement = event.target;
    let parentElem = currentElement.parentNode;
    currentElement.classList.toggle(`${styles.active}`);
    var panelControl = currentElement.nextElementSibling;
    if (panelControl.style.height) {
      panelControl.style.height = null;
      parentElem.classList.remove(`${styles.outerDivVisited}`);
    }
    else {
      let maxheight: number = 0;
      if (panelControl.scrollHeight === 0) {
        maxheight = 40;
      }
      else {
        maxheight = panelControl.scrollHeight + 30;
      }
      panelControl.style.height = maxheight + "px";
      parentElem.classList.add(`${styles.outerDivVisited}`);
    }
  }



  protected editiorTextOnChangeHandler = (key, event) => {
    console.log(key);
    let content : string = event.target.getContent();
    let regexBoldOpen = new RegExp(/\[b\]/);
    let regexBoldClose = new RegExp(/\[\/b\]/);
    content = content.replace(regexBoldOpen, "<strong>");
    content  = content.replace(regexBoldClose, "</strong>");
    this.props.updateContent(key, content);
  }


  public render(): React.ReactElement<IAccordionProps> {

    const renderAccordionEditor: JSX.Element[] = (this.props.accordionData && this.props.accordionData.length > 0) ?
      this.props.accordionData.map((data: any, index: number) => {
        return (
          <div className={styles.editModeHolder} key={index}>
            <div className={styles.title}>{escape(data.Title)}</div>
            <div>
              <Editor
                init={{
                  plugins: ['paste', 'link', 'lists', 'table', 'textcolor', 'bbcode', 'pagebreak', 'advlist'],
                  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | bbcode',
                  skin_url: "../../src/webparts/accordion/skins/lightgray/"
                }}
                onChange={this.editiorTextOnChangeHandler.bind(this, index)}
                initialValue={data.Content ? data.Content : ""}
              />
            </div>
          </div>
        );
      })
      :
      null;

    const renderAccordionHolder: JSX.Element = (this.props.accordionData && this.props.accordionData.length > 0) ?
      <div>
        {this.props.accordionData.map((data: any, index: number) => {
          return (
            <div className={styles.outerDiv} key={index}>
              <button className={styles.accordion} onClick={this.clicked.bind(this)}>{escape(data.Title)}</button>
              <div className={styles.panel}>
                <div>{ReactHtmlParser(data.Content)}</div>
              </div>
            </div>
          );
        })}
      </div>
      :
      null;

    return (
      <div>
        {
          this.props.isReadMode ? renderAccordionHolder : renderAccordionEditor
        }
      </div>
    );
  }
}
