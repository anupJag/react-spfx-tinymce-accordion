export interface IAccordionProps {
  accordionData : any[];
  isReadMode : boolean;
  updateContent : (key : number, data : any) => void;
}
