import { DisplayMode } from '@microsoft/sp-core-library';

export interface IAccordionProps {
  accordionData : any[];
  isReadMode : boolean;
  updateContent : (key : number, data : any) => void;
  onConfigure : () => void;
  displayMode: DisplayMode;
  fUpdateProperty: (value: string) => void;
  title: string;
}
