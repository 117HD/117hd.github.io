'use strict';

import {Position} from '../../model/Position.js';
import {Path} from '../../model/Path.js';
import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class QuantumBotPathConverter extends OSBotPathConverter {

    constructor() {
        super();
        this.javaArea = "AABB";
        this.javaPosition = "Tile";
    }
}