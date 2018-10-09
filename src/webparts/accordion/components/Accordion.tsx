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
import 'tinymce/plugins/advlist';
import { Editor } from '@tinymce/tinymce-react';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
//const skin : any = require('../../../../sharepoint/assets/skins/pnp');

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
    if (panelControl.style.maxHeight) {
      panelControl.style.maxHeight = null;
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
      panelControl.style.maxHeight = maxheight + "px";
      parentElem.classList.add(`${styles.outerDivVisited}`);
    }
  }



  protected editiorTextOnChangeHandler = (key, event) => {
    console.log(key);
    let content: string = event.target.getContent();
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
                  plugins: ['paste', 'link', 'lists', 'table', 'textcolor', 'advlist'],
                  toolbar1: 'formatselect | bold italic forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent',
                  skin_url: 'https://team.effem.com/jQuery/tinymce/skins/pnp'
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
              <button className={styles.accordion} onClick={this.clicked.bind(this)}>
              {data.Title}</button>
              <div className={styles.panel}>
                <div>{ReactHtmlParser(data.Content)}</div>
              </div>
            </div>
          );
        })}
      </div>
      :
      null;

    const placeholder: JSX.Element =
      <Placeholder
        iconName='Edit'
        iconText='Configure your web part'
        description='Please configure the web part.'
        buttonLabel='Configure'
        onConfigure={this.props.onConfigure} />;

    const webPartTitle: JSX.Element =
      <WebPartTitle
        displayMode={this.props.displayMode}
        title={this.props.title}
        updateProperty={this.props.fUpdateProperty} />;

    return (
      <div>
        {webPartTitle}
        {
          (this.props.accordionData && this.props.accordionData.length > 0) ?
            (this.props.isReadMode ? renderAccordionHolder : renderAccordionEditor) :
            placeholder
        }
      </div>
    );
  }
}
