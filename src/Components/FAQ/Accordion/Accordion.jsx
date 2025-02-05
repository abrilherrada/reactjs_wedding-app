import {useState} from "react";
import AccordionItem from "./AccordionItem/AccordionItem.jsx";
import data from "../../../data/data_FAQ.jsx"
import styles from './Accordion.module.css';

function Accordion () {
    const [currentIndex, setCurrentIndex] = useState(null);
    
    const handleItemClick = (categoryIndex, itemIndex) => {
        const newIndex = `${categoryIndex}-${itemIndex}`;
        setCurrentIndex((previousIndex) => (previousIndex === newIndex ? null : newIndex));
    };

    return (
      <div className={styles.container}>
          {data.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                  <h3 className={styles.categoryTitle}>{category.category}</h3>
                  <div className={styles.categoryItems}>
                      {category.items.map((item, itemIndex) => (
                          <AccordionItem 
                              key={`${categoryIndex}-${itemIndex}`}
                              question={item.question}
                              answer={item.answer}
                              isOpen={currentIndex === `${categoryIndex}-${itemIndex}`}
                              onClick={() => handleItemClick(categoryIndex, itemIndex)}
                          />
                      ))}
                  </div>
              </div>
          ))}
      </div>
    );
}

export default Accordion;