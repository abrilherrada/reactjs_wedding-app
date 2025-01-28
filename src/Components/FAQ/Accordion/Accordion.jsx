import {useState} from "react";
import AccordionItem from "./AccordionItem/AccordionItem.jsx";
import data from "../../../data/data_FAQ.jsx"

function Accordion () {
    const [currentIndex, setCurrentIndex] = useState(null);
    
    const handleItemClick = (index) => {
        setCurrentIndex((previousIndex) => (previousIndex === index ? null : index));
    };

    return (
      <>
          {data.map((item, index) => (
              <AccordionItem  key={index} 
                              question={item.question}
                              answer={item.answer} 
                              isOpen={currentIndex === index} 
                              onClick={() => handleItemClick(index)}
              />
          ))}
      </>
    )
}

export default Accordion;