import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'AccordionWebPartStrings';
import Accordion from './components/Accordion';
import { IAccordionProps } from './components/IAccordionProps';

export interface IAccordionWebPartProps {
  accordionData : any[];
  title : string;
}

export default class AccordionWebPart extends BaseClientSideWebPart<IAccordionWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAccordionProps > = React.createElement(
      Accordion,
      {
        accordionData : this.properties.accordionData,
        isReadMode : DisplayMode.Read === this.displayMode,
        updateContent : this.updateContent.bind(this),
        onConfigure : this._onConfigure.bind(this),
        title: this.properties.title,
        displayMode: this.displayMode,
        fUpdateProperty: (value: string) => {
          this.properties.title = value;
        },
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _onConfigure() {
    // Context of the web part
    this.context.propertyPane.open();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected updateContent = (key : number, data : any): void => {
    this.properties.accordionData[key].Content = data;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Accordion allows you to quickly build Show/Hide data"
          },
          groups: [
            {
              groupName: "Accordion Data",
              groupFields: [
                PropertyFieldCollectionData('accordionData', {
                  key: "accordionData",
                  label : "Configure your Titles for Accordion",
                  manageBtnLabel : "Manage Accordion Data",
                  panelHeader : "Accordion Title Setup",
                  value : this.properties.accordionData,
                  fields : [
                    {
                      id : "Title",
                      title : "Title",
                      type : CustomCollectionFieldType.string,
                      required : true,
                      placeholder : "Enter Accordion Title"
                    }
                  ]
                })
              ]
            }            
          ]
        }
      ]
    };
  }
}
