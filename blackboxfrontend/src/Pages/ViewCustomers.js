import React from "react";
import AccordionComponent from "../Components/Accordion";

const ViewCustomers = ({ title }) => {
  return (
    <>
      <div>
        <AccordionComponent title={title} />
      </div>
    </>
  );
};

export default ViewCustomers;
