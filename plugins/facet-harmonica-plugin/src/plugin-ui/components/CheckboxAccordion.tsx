import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Checkbox,
    Label,
} from '@deenruv/react-ui-devkit';
import { FacetValue } from '../graphql';
interface CheckboxAccordionProps {
    checkedFacetsIds?: string[];
    title: string | undefined;
    allFacets: FacetValue[] | undefined;
    onChange: (itemId: string, checked: boolean) => void;
}

export const CheckboxAccordion: React.FC<CheckboxAccordionProps> = ({
    checkedFacetsIds,
    title,
    allFacets,
    onChange,
}) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-4 gap-4">
                        {allFacets?.map(f => (
                            <div key={f.code} className="flex items-center  gap-3">
                                <Checkbox
                                    name={f.code}
                                    id={f.code}
                                    checked={checkedFacetsIds?.includes(f.id)}
                                    onCheckedChange={(e: boolean) => onChange(f.id, e)}
                                />
                                <Label htmlFor={f.code} className="flex items-center gap-2 font-normal">
                                    {f.customFields?.hexColor && f.customFields?.hexColor !== '#' && (
                                        <div
                                            className="border-gray h-4 w-4 rounded-full border border-solid"
                                            style={{ backgroundColor: f.customFields?.hexColor }}
                                        ></div>
                                    )}
                                    {f.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
