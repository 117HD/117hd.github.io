'use strict';

import {Area} from '../../model/Area.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';
import {AABB} from './AABB.js';
import {RegionBox} from './RegionBox.js';

export class HD117AreasConverter extends OSBotAreasConverter {
    
    constructor() {
        super();
        this.javaArea = "AABB";
        this.javaPosition = "AABB";
    }



    parseSections(jsonStrings, keys) {
        let parsedSectionsArray = [];

        // Ensure jsonStrings is an array (if it's not already)
        if (!Array.isArray(jsonStrings)) {
            jsonStrings = [jsonStrings];
        }

        // Loop through each JSON string
        jsonStrings.forEach(jsonString => {
            let sections = {};

            // Trim whitespace from JSON string
            jsonString = jsonString.trim();

            // Parse the JSON string into an object
            let jsonObject = JSON.parse(jsonString);

            // Loop through each key and extract the corresponding section
            keys.forEach(key => {
                if (jsonObject.hasOwnProperty(key)) {
                    // Check if the value is an array or a single element
                    if (Array.isArray(jsonObject[key][0])) {
                        // It's an array of arrays
                        sections[key] = jsonObject[key];
                    } else {
                        // Wrap single element in an array
                        sections[key] = [jsonObject[key]];
                    }
                }
            });

            // Push parsed sections object into array
            parsedSectionsArray.push(sections);
        });

        return parsedSectionsArray;
    }

    fromJava(text, areas) {
        areas.removeAll();
        let keys = ["regionBoxes", "aabbs", "regions"];

        try {
            const formattedText = `{${text}}`;
            let parsedSections = this.parseSections(formattedText, keys);

            parsedSections.forEach((sections, index) => {
                // Process aabbs
                if (sections.aabbs && Array.isArray(sections.aabbs)) {
                    sections.aabbs.forEach(aabb => {
                        let aabbData;

                        switch (aabb.length) {
                            case 4:
                                aabbData = new AABB(aabb[0], aabb[1], 0, aabb[2], aabb[3], 0);
                                break;
                            case 6:
                                aabbData = new AABB(aabb[0], aabb[1], aabb[2], aabb[3], aabb[4], aabb[5]);
                                break;
                            default:
                                console.log(`Unexpected format for AABB: ${aabb}`);
                                return; // Exit the current iteration if format is unexpected
                        }

                        // Add the area after switch cases
                        areas.add(new Area(
                            new Position(aabbData.minX, aabbData.minY, aabbData.minZ),
                            new Position(aabbData.maxX, aabbData.maxY, aabbData.maxZ)
                        ));
                    });
                }

                // Process regions
                if (sections.regions && Array.isArray(sections.regions)) {
                    sections.regions.forEach(regionId => {
                        let regionData = new AABB(regionId);
                        areas.add(new Area(
                            new Position(regionData.minX, regionData.minY, regionData.minZ),
                            new Position(regionData.maxX, regionData.maxY, regionData.maxZ)
                        ));
                    });
                } else if (sections.regions) {
                    console.log('Regions field is not an array:', sections.regions);
                }

                // Process regionBoxes
                if (sections.regionBoxes && Array.isArray(sections.regionBoxes)) {
                    sections.regionBoxes.forEach(box => {
                        const from = box[0];
                        const to = box[1];

                        const regionBox = new RegionBox(from, to);
                        const aabb = regionBox.toAabb();

                        areas.add(new Area(
                            new Position(aabb.minX, aabb.minY, aabb.minZ),
                            new Position(aabb.maxX, aabb.maxY, aabb.maxZ)
                        ));
                    });
                } else if (sections.regionBoxes) {
                    console.log('RegionBoxes field is not an array:', sections.regionBoxes);
                }
            });

        } catch (error) {
            console.error('Error parsing or processing input:', error);
        }
    }

    toJavaArray(areas) {
        if (areas.areas.length === 1) {
            let singleArea = this.toJavaSingle(areas.areas[0]);
            return `"aabbs": [\n    [ ${singleArea.join(', ')} ]\n ]`;
        } else if (areas.areas.length > 1) {
            let aabbs = areas.areas.map(area => this.toJavaSingle(area));
            let formattedAABBs = aabbs.map(arr => `    [ ${arr.join(', ')} ]`).join(',\n');
            return `"aabbs": [\n${formattedAABBs}\n]`;
        }
        return "";
    }

    toJavaSingle(area) {
        let startX = Math.min(area.startPosition.x, area.endPosition.x);
        let endX = Math.max(area.startPosition.x, area.endPosition.x);
        let startY = Math.min(area.startPosition.y, area.endPosition.y);
        let endY = Math.max(area.startPosition.y, area.endPosition.y);

        let plane = area.startPosition.z;

        return plane > 0 ? [startX, startY, plane, endX, endY, plane] : [startX, startY, endX, endY];
    }
}