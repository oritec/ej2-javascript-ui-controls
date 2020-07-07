/**
 * AccumulationChart DataLabel module file
 */
import { extend, createElement, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect, Size, PathOption, measureText, TextOption } from '@syncfusion/ej2-svg-base';
import { ChartLocation, degreeToLocation, isOverlap, stringToNumber, getAngle, appendChildElement } from '../../common/utils/helper';
import { textTrim, subtractThickness, Thickness, getElement } from '../../common/utils/helper';
import { removeElement, RectOption, textElement, showTooltip } from '../../common/utils/helper';
import { ColorValue, colorNameToHex, convertHexToColor, containsRect } from '../../common/utils/helper';
import { AccumulationLabelPosition } from '../model/enum';
import { AccPoints, getSeriesFromIndex, AccumulationSeries } from '../model/acc-base';
import { IAccTextRenderEventArgs } from '../model/pie-interface';
import { AccumulationDataLabelSettingsModel } from '../model/acc-base-model';
import { MarginModel, FontModel, ConnectorModel, BorderModel } from '../../common/model/base-model';
import { textRender } from '../../common/model/constants';
import { AccumulationChart } from '../accumulation';
import { getFontStyle, createTemplate, measureElementRect, templateAnimate } from '../../common/utils/helper';
import { AccumulationBase } from './accumulation-base';

/**
 * AccumulationDataLabel module used to render `dataLabel`.
 */
export class AccumulationDataLabel extends AccumulationBase {
    /** @private */
    public titleRect: Rect;
    /** @private */
    public areaRect: Rect;
    /** @private */
    public clearTooltip: number;
    private id: string;
    public marginValue: number;
    /**
     * This varaible indicated the change of angle direction.
     * Such as increase/decrease the label angle while doing smart label arrangements.
     */
    private isIncreaseAngle: boolean;
    private rightSideRenderingPoints: AccPoints[] = [];
    private leftSideRenderingPoints: AccPoints[] = [];
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.id = accumulation.element.id + '_datalabel_Series_';
        if (accumulation.title) {
            let titleSize: Size = measureText(accumulation.title, accumulation.titleStyle);
            this.titleRect = new Rect(
                accumulation.availableSize.width / 2 - titleSize.width / 2,
                accumulation.margin.top,
                titleSize.width, titleSize.height
            );
        }
    }
    /**
     * Method to get datalabel text location.
     * @private
     */

    public getDataLabelPosition(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, textSize: Size,
        points: AccPoints[], parent: Element, id: string): void {
        let radius: number = this.isCircular() ? (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);

        //let radius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);

        this.getLabelRegion(point, dataLabel.position, textSize, radius, this.marginValue);
        point.labelAngle = point.midAngle;
        point.labelPosition = dataLabel.position;
        if (this.accumulation.enableSmartLabels) {
            this.getSmartLabel(point, dataLabel, textSize, points, parent, id);
        }
    }
    /**
     * Method to get datalabel bound.
     */

    private getLabelRegion(
        point: AccPoints, position: AccumulationLabelPosition, textSize: Size,
        labelRadius: number, margin: number, endAngle: number = 0): void {
        let labelAngle: number = endAngle || point.midAngle;
        let space: number = 10;

        let location: ChartLocation = degreeToLocation(labelAngle, labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));

        location.y = (position === 'Inside') ? (location.y - textSize.height / 2) : location.y;
        location.x = (position === 'Inside') ? (location.x - textSize.width / 2) : location.x;

        point.labelRegion = new Rect(
            location.x, location.y, textSize.width + (margin * 2), textSize.height + (margin * 2));

        if (position === 'Outside') {
            point.labelRegion.y -= point.labelRegion.height / 2;
            if (labelAngle >= 90 && labelAngle <= 270) {
                point.labelRegion.x -= (point.labelRegion.width + space);
            } else {
                point.labelRegion.x += space;
            }
        }
    }

    /**
     * Method to get datalabel smart position.
     */
    private getSmartLabel(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, textSize: Size,
        points: AccPoints[], parent: Element, id: string): void {

        let circular: boolean = this.isCircular();

        let labelRadius: number = circular ? this.radius : this.getLabelDistance(point, dataLabel);

        let connectorLength: string = circular ? (dataLabel.connectorStyle.length || '4%') :
            '0px';

        labelRadius += stringToNumber(connectorLength, labelRadius);

        let previousPoint: AccPoints = this.findPreviousPoint(points, point.index, point.labelPosition);

        if (dataLabel.position === 'Inside') {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points)) || !circular && !containsRect(point.region, point.labelRegion)) {
                point.labelPosition = 'Outside';
                if (!circular) {
                    labelRadius = this.getLabelDistance(point, dataLabel);
                }
                this.getLabelRegion(point, point.labelPosition, textSize, labelRadius, this.marginValue);
                previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
                if (previousPoint && (isOverlap(point.labelRegion, previousPoint.labelRegion) ||
                    this.isConnectorLineOverlapping(point, previousPoint))) {
                    this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
                }
            }
        } else {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
            }
        }
        if (this.isOverlapping(point, points) && (this.accumulation.type === 'Pyramid' || this.accumulation.type === 'Funnel')) {
            let position : string = 'OutsideLeft';
            let space : number = 10;
            let labelAngle: number = point.midAngle || 0 ;
            let labelRadius: number = circular ? this.radius : this.getLabelDistance(point, dataLabel);
            let location: ChartLocation = degreeToLocation(labelAngle, -labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));
            point.labelRegion = new Rect(
            location.x, location.y, textSize.width + (this.marginValue * 2), textSize.height + (this.marginValue * 2));
            point.labelRegion.y -= point.labelRegion.height / 2;
            point.labelRegion.x = point.labelRegion.x - space - point.labelRegion.width ;
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
            }
        }
    }

    /**
     * To find trimmed datalabel tooltip needed.
     * @return {void}
     * @private
     */
    public move(e: Event, x: number, y: number, isTouch?: boolean): void {
        if ((<HTMLElement>e.target).textContent.indexOf('...') > -1) {
            let targetId: string[] = (<HTMLElement>e.target).id.split(this.id);
            if (targetId.length === 2) {
                let seriesIndex: number = parseInt(targetId[1].split('_text_')[0], 10);
                let pointIndex: number = parseInt(targetId[1].split('_text_')[1], 10);
                if (!isNaN(seriesIndex) && !isNaN(pointIndex)) {
                    if (isTouch) {
                        removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
                    }
                    let point: AccPoints = getSeriesFromIndex(seriesIndex, (this.accumulation).visibleSeries).points[pointIndex];
                    showTooltip(
                        point.text || point.y.toString(), x, y, this.areaRect.width,
                        this.accumulation.element.id + '_EJ2_Datalabel_Tooltip',
                        getElement(this.accumulation.element.id + '_Secondary_Element'),
                    );
                }
            }
        } else {
            removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
        }
        if (isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = +setTimeout(() => { removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip'); }, 1000);
        }
    }
    /**
     * To find previous valid label point
     */
    private findPreviousPoint(points: AccPoints[], index: number, position: AccumulationLabelPosition): AccPoints {
        let point: AccPoints = points[0];
        for (let i: number = index - 1; i >= 0; i--) {
            point = points[i];
            if (point.visible && point.labelVisible && point.labelRegion && point.labelPosition === position) {
                return point;
            }
        }
        return null;
    }
    /**
     * To find current point datalabel is overlapping with other points
     */
    private isOverlapping(currentPoint: AccPoints, points: AccPoints[]): boolean {
        for (let i: number = currentPoint.index - 1; i >= 0; i--) {
            if (points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    }
    /**
     * To get text trimmed while exceeds the accumulation chart area.
     */
    private textTrimming(point: AccPoints, rect: Rect, font: FontModel, position: string): void {
        if (isOverlap(point.labelRegion, rect)) {
            let size: number = point.labelRegion.width;
            if (position === 'Right') {
                size = rect.x - point.labelRegion.x;
            } else if (position === 'Left') {
                size = point.labelRegion.x - (rect.x + rect.width);
                if (size < 0) {
                    size += point.labelRegion.width;
                    point.labelRegion.x = rect.x + rect.width;
                }
            } else if (position === 'InsideRight') {
                size = (rect.x + rect.width) - point.labelRegion.x;
            } else if (position === 'InsideLeft') {
                size = (point.labelRegion.x + point.labelRegion.width) - rect.x;
                if (size < point.labelRegion.width) {
                    point.labelRegion.x = rect.x;
                }
            } else {
                this.setPointVisibileFalse(point);
            }
            if (point.labelVisible && point.labelRegion) {
                if (size < point.labelRegion.width) {
                    point.label = textTrim(size - (this.marginValue * 2), point.label, font);
                    point.labelRegion.width = size;
                }
                if (point.label.length === 3 && point.label.indexOf('...') > -1) {
                    this.setPointVisibileFalse(point);
                }
            }
        }
    }
    /**
     * To set point label visible and region to disable.
     */
    private setPointVisibileFalse(point: AccPoints): void {
        point.labelVisible = false;
        point.labelRegion = null;
    }
    /**
     * To set datalabel angle position for outside labels
     */
    private setOuterSmartLabel(
        previousPoint: AccPoints, point: AccPoints, border: number, labelRadius: number,
        textsize: Size, margin: number): void {
        if (!this.isCircular()) {
            this.setSmartLabelForSegments(point, previousPoint, labelRadius, textsize, margin);
        } else {
            let labelAngle: number = this.getOverlappedAngle(previousPoint.labelRegion, point.labelRegion, point.midAngle, border * 2);
            this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
            if (labelAngle > point.endAngle) {
                labelAngle = point.midAngle;
                //this.setPointVisibileFalse(point);
            }
            point.labelAngle = labelAngle;
            while (point.labelVisible && (isOverlap(previousPoint.labelRegion, point.labelRegion) || labelAngle <= previousPoint.labelAngle
                || this.isConnectorLineOverlapping(point, previousPoint))) {
                if (labelAngle > point.endAngle) {
                    //this.setPointVisibileFalse(point);
                    break;
                }
                point.labelAngle = labelAngle;
                this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
                labelAngle += 0.1;
            }
        }
    }

    /**
     * Sets smart label positions for funnel and pyramid series
     */
    private setSmartLabelForSegments(
        point: AccPoints, prevPoint: AccPoints, distance: number, textSize: Size, margin: number): void {
        let textRegion: Rect = point.labelRegion;
        //let overlapWidth: number = prevPoint.labelRegion.x + prevPoint.labelRegion.width - textRegion.x;
        let overlapHeight: number = this.accumulation.type === 'Funnel' ?
            prevPoint.labelRegion.y - (textRegion.y + textRegion.height) :
            point.labelRegion.y - (prevPoint.labelRegion.y + prevPoint.labelRegion.height);
        if (overlapHeight < 0) {
            point.labelRegion.y += this.accumulation.type === 'Funnel' ? overlapHeight : -overlapHeight;
        }
    }

    /**
     * To find connector line overlapping.
     */
    private isConnectorLineOverlapping(point: AccPoints, previous: AccPoints): boolean {
        let position: string ;
        if (!this.isCircular() && point.labelRegion.x < point.region.x) {
            position = 'outsideLeft';
        }
        let start: ChartLocation = this.getLabelLocation(point, position );
        let end: ChartLocation = new ChartLocation(0, 0);
        this.getEdgeOfLabel(point.labelRegion, point.labelAngle, end, 0, point);

        let previousstart: ChartLocation = this.getLabelLocation(previous);
        let previousend: ChartLocation = new ChartLocation(0, 0);
        this.getEdgeOfLabel(previous.labelRegion, previous.labelAngle, previousend, 0, point);
        return this.isLineRectangleIntersect(start, end, point.labelRegion) ||
            this.isLineRectangleIntersect(start, end, previous.labelRegion) ||
            this.isLineRectangleIntersect(previousstart, previousend, point.labelRegion);
    }
    /**
     * To find two rectangle intersect
     */
    private isLineRectangleIntersect(line1: ChartLocation, line2: ChartLocation, rect: Rect): boolean {
        let rectPoints: ChartLocation[] = [
            new ChartLocation(Math.round(rect.x), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round((rect.y + rect.height))),
            new ChartLocation(Math.round(rect.x), Math.round((rect.y + rect.height)))
        ];
        line1.x = Math.round(line1.x);
        line1.y = Math.round(line1.y);
        line2.x = Math.round(line2.x);
        line2.y = Math.round(line2.y);
        for (let i: number = 0; i < rectPoints.length; i++) {
            if (this.isLinesIntersect(line1, line2, rectPoints[i], rectPoints[(i + 1) % rectPoints.length])) {
                return true;
            }
        }
        return false;
    }
    /**
     * To find two line intersect
     */
    private isLinesIntersect(point1: ChartLocation, point2: ChartLocation, point11: ChartLocation, point12: ChartLocation): boolean {
        let a1: number = point2.y - point1.y;
        let b1: number = point1.x - point2.x;
        let c1: number = a1 * point1.x + b1 * point1.y;
        let a2: number = point12.y - point11.y;
        let b2: number = point11.x - point12.x;
        let c2: number = a2 * point11.x + b2 * point11.y;
        let delta: number = a1 * b2 - a2 * b1;
        if (delta !== 0) {
            let x: number = (b2 * c1 - b1 * c2) / delta;
            let y: number = (a1 * c2 - a2 * c1) / delta;
            let lies: boolean = Math.min(point1.x, point2.x) <= x && x <= Math.max(point1.x, point2.x);
            lies = lies && Math.min(point1.y, point2.y) <= y && y <= Math.max(point1.y, point2.y);
            lies = lies && Math.min(point11.x, point12.x) <= x && x <= Math.max(point11.x, point12.x);
            lies = lies && Math.min(point11.y, point12.y) <= y && y <= Math.max(point11.y, point12.y);
            return lies;
        }
        return false;
    }
    /**
     * To get two rectangle overlapping angles.
     */
    private getOverlappedAngle(first: Rect, second: Rect, angle: number, padding: number): number {
        let x: number = first.x;
        if (angle >= 90 && angle <= 270) {
            second.y = first.y - (padding + second.height / 2);
            x = first.x + first.width;
        } else {
            second.y = first.y + first.height + padding;
        }
        return getAngle(this.center, new ChartLocation(x, second.y));
    }

    /**
     * To get connector line path
     */
    private getConnectorPath(label: Rect, point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, end: number = 0): string {
        let connector: ConnectorModel = dataLabel.connectorStyle;

        let labelRadius: number = this.isCircular() ? (!this.isVariousRadius() ? this.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);
        //let labelRadius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);

        let start: ChartLocation = this.getConnectorStartPoint(point, connector);

        let labelAngle: number = this.accumulation.enableSmartLabels ? point.midAngle :  end || point.midAngle;

        let middle: ChartLocation = new ChartLocation(0, 0);

        let endPoint: ChartLocation = this.getEdgeOfLabel(label, labelAngle, middle, connector.width, point);

        if (connector.type === 'Curve') {
            if (this.isCircular()) {
                let r: number = labelRadius - (
                    this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                        this.radius);
                //let r: number = labelRadius - this.radius;
                if (point.isLabelUpdated) {
                    middle = this.getPerpendicularDistance(start, point);
                } else {
                    middle = degreeToLocation(labelAngle, labelRadius - (r / 2), this.center);
                    if (point.labelPosition === 'Outside' && dataLabel.position === 'Inside') {
                        middle = degreeToLocation(labelAngle, labelRadius - r * 1.25, this.center);
                    }
                }
                return 'M ' + start.x + ' ' + start.y + ' Q ' + middle.x + ' ' + middle.y + ' ' + endPoint.x + ' ' + endPoint.y;
            } else {
                return this.getPolyLinePath(start, endPoint);
            }
        } else {
            return 'M ' + start.x + ' ' + start.y + ' L ' + middle.x + ' ' + middle.y + ' L ' + endPoint.x + ' ' + endPoint.y;
        }
    }

    /**
     * Finds the curved path for funnel/pyramid data label connectors
     */
    private getPolyLinePath(start: ChartLocation, end: ChartLocation): string {
        let controlPoints: ChartLocation[] = [start, end];
        if (start.y === end.y) {
            return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y;
        }
        let path: string = 'M';
        for (let i: number = 0; i <= 16; i++) {
            let t: number = i / 16;
            let points: ChartLocation = this.getBezierPoint(t, controlPoints, 0, 2);
            path += points.x + ',' + points.y;
            if (i !== 16) {
                path += ' L';
            }
        }
        return path;
    }

    /**
     * Finds the bezier point for funnel/pyramid data label connectors
     */
    private getBezierPoint(t: number, controlPoints: ChartLocation[], index: number, count: number): ChartLocation {
        if (count === 1) {
            return controlPoints[index];
        }
        let p0: ChartLocation = this.getBezierPoint(t, controlPoints, index, count - 1);
        let p1: ChartLocation = this.getBezierPoint(t, controlPoints, index + 1, count - 1);
        let x: number = (p0.x) ? p0.x : p0.x;
        let y: number = (p0.y) ? p0.y : p0.y;
        let x1: number = (p1.x) ? p1.x : p1.x;
        let y1: number = (p1.y) ? p1.y : p1.y;
        let x2: number = (1 - t) * x + t * x1;
        let y2: number = (1 - t) * y + t * y1;
        if (p0.x) {
            return { x: x2, y: y2 };
        } else {
            return { x: x2, y: y2 };
        }
    }

    /**
     * To get label edges based on the center and label rect position.
     */
    private getEdgeOfLabel(labelshape: Rect, angle: number, middle: ChartLocation,  border: number = 1, point ?: AccPoints): ChartLocation {
        let edge: ChartLocation = new ChartLocation(labelshape.x, labelshape.y);
        if (angle >= 90 && angle <= 270) {
            edge.x += labelshape.width + border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        } else if (point && point.region && point.region.x > point.labelRegion.x ) {
            edge.x += border * 2 + labelshape.width;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        } else {
            edge.x -= border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x - 10;
            middle.y = edge.y;
        }
        return edge;
    }

    /**
     * Finds the distance between the label position and the edge/center of the funnel/pyramid
     */
    private getLabelDistance(point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel): number {
        if (point.labelPosition && dataLabel.position !== point.labelPosition || dataLabel.connectorStyle.length) {
            let length: number = stringToNumber(dataLabel.connectorStyle.length || '70px', this.accumulation.initialClipRect.width);
            if (length < this.accumulation.initialClipRect.width) {
                return length;
            }
        }

        let position: AccumulationLabelPosition = point.labelPosition || dataLabel.position;
        let series: AccumulationSeries = this.accumulation.visibleSeries[0];
        let extraSpace: number = (this.accumulation.initialClipRect.width - series.triangleSize.width) / 2;

        let labelLocation: number;
        switch (position) {
            case 'Inside':
                return 0;
            case 'Outside':
                labelLocation = point.symbolLocation.x + point.labelOffset.x;
                return this.accumulation.initialClipRect.width - labelLocation - extraSpace;
        }
    }

    /**
     * Finds the label position / beginning of the connector(ouside funnel labels)
     */
    private getLabelLocation(point: AccPoints, position: AccumulationLabelPosition | string = 'Outside'): ChartLocation {
        if (this.accumulation.type !== 'Pie') {
            position = position === 'OutsideLeft' ? 'OutsideLeft' :   point.labelPosition || position;
            let location: ChartLocation = {
                x: point.symbolLocation.x,
                y: point.symbolLocation.y - point.labelOffset.y
            };
            switch (position) {
                case 'Inside':
                    location.y = point.region.y + point.region.height / 2;
                    break;
                case 'Outside':
                    location.x += point.labelOffset.x;
                    break;
                case 'OutsideLeft':
                     location.x -= point.labelOffset.x;

            }
            return location;
        } else {
            //return degreeToLocation(point.midAngle, this.radius, this.center);
            return degreeToLocation(
                point.midAngle,
                (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                    this.radius),
                this.center
            );

        }
    }

    /**
     * Finds the beginning of connector line
     */
    private getConnectorStartPoint(point: AccPoints, connector: ConnectorModel): ChartLocation {
        // return this.isCircular() ? degreeToLocation(point.midAngle, this.radius - connector.width, this.center) :
        //     this.getLabelLocation(point);
        let position : string;
        if (!this.isCircular() && point.region.x > point.labelRegion.x ) {
            position  = 'OutsideLeft';
        }
        return this.isCircular() ? degreeToLocation(
            point.midAngle,
            (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                this.radius) - connector.width,
            this.center
        ) : this.getLabelLocation(point, position);

    }

    /**
     * To find area rect based on margin, available size.
     * @private
     */
    public findAreaRect(): void {
        this.areaRect = new Rect(0, 0, this.accumulation.availableSize.width, this.accumulation.availableSize.height);
        let margin: MarginModel = this.accumulation.margin;
        subtractThickness(this.areaRect, new Thickness(margin.left, margin.right, margin.top, margin.bottom));
    }
    /**
     * To render the data labels from series points.
     */
    public renderDataLabel(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, parent: Element,
        points: AccPoints[], series: number, templateElement?: HTMLElement,
        redraw?: boolean
    ): void {
        let id: string = this.accumulation.element.id + '_datalabel_Series_' + series + '_';
        let datalabelGroup: Element = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
        point.label = point.originalText || point.y.toString();
        let border: BorderModel = { width: dataLabel.border.width, color: dataLabel.border.color };
        let argsFont: FontModel = <FontModel>(extend({}, getValue('properties', dataLabel.font), null, true));
        let argsData: IAccTextRenderEventArgs = {
            cancel: false, name: textRender, series: this.accumulation.visibleSeries[0], point: point,
            text: point.label, border: border, color: dataLabel.fill, template: dataLabel.template, font: argsFont
        };
        this.accumulation.trigger(textRender, argsData);
        point.argsData = argsData;
        let angle: number; let degree: number;
        let isTemplate: boolean = argsData.template !== null;
        point.labelVisible = !argsData.cancel; point.text = point.label = argsData.text;
        if (Number(point.label)) {
            point.label = this.accumulation.intl.formatNumber(+point.label, {
                useGrouping: this.accumulation.useGroupingSeparator});
            }
        this.marginValue = argsData.border.width ? (5 + argsData.border.width) : 1;
        // Template element
        let childElement: HTMLElement = createElement('div', {
            id: this.accumulation.element.id + '_Series_' + 0 + '_DataLabel_' + point.index,
            styles: 'position: absolute;background-color:' + argsData.color + ';' +
                getFontStyle(dataLabel.font) + ';border:' + argsData.border.width + 'px solid ' + argsData.border.color + ';'
        });
        let textSize: Size = isTemplate ? this.getTemplateSize(childElement, point, argsData, redraw) :
            measureText(point.label, dataLabel.font);
        textSize.height += 4; // 4 for calculation with padding for smart label shape
        textSize.width += 4;
        point.textSize = textSize;
        this.getDataLabelPosition(point, dataLabel, textSize, points, datalabelGroup, id);
        if (point.labelRegion) {
            this.correctLabelRegion(point.labelRegion, point.textSize);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public drawDataLabels(series: AccumulationSeries, dataLabel: AccumulationDataLabelSettingsModel, parent: HTMLElement,
                          templateElement?: HTMLElement, redraw?: boolean): void {
        let angle: number; let degree: number;
        let modifiedPoints: AccPoints[] = series.leftSidePoints.concat(series.rightSidePoints);
        modifiedPoints.sort((a: AccPoints, b: AccPoints) => a.index - b.index);
        if (series.type === 'Pie' && this.accumulation.enableSmartLabels) {
            this.extendedLabelsCalculation();
        }
        for (let point of modifiedPoints) {
            if (!isNullOrUndefined(point.argsData) && !isNullOrUndefined(point.y)) {
                this.finalizeDatalabels(point, modifiedPoints, dataLabel);
                let id: string = this.accumulation.element.id + '_datalabel_Series_' + 0 + '_';
                let datalabelGroup: Element = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
                let dataLabelElement: Element; let location: ChartLocation;
                // tslint:disable-next-line:max-line-length
                let childElement: HTMLElement = createElement('div', {
                    id: this.accumulation.element.id + '_Series_' + 0 + '_DataLabel_' + point.index,
                    styles: 'position: absolute;background-color:' + point.argsData.color + ';' +
                        // tslint:disable-next-line:max-line-length
                        getFontStyle(dataLabel.font) + ';border:' + point.argsData.border.width + 'px solid ' + point.argsData.border.color + ';'
                });
                let textSize: Size = point.argsData ?
                    this.getTemplateSize(childElement, point, point.argsData, redraw) :
                    measureText(point.label, dataLabel.font);
                let element: Element;
                if (point.visible && point.labelVisible) {
                    angle = degree = dataLabel.angle;
                    if (point.argsData.template) {
                        this.setTemplateStyle(
                            childElement, point, templateElement, dataLabel.font.color, point.color, redraw);
                    } else {
                        location = new ChartLocation(
                            // tslint:disable-next-line:max-line-length
                            point.labelRegion.x + this.marginValue, point.labelRegion.y + (point.textSize.height * 3 / 4) + this.marginValue);
                        element = getElement(id + 'shape_' + point.index);
                        let startLocation: ChartLocation = element ? new ChartLocation(
                            +element.getAttribute('x'), +element.getAttribute('y')
                        ) : null;
                        dataLabelElement = this.accumulation.renderer.drawRectangle(new RectOption(
                            id + 'shape_' + point.index, point.argsData.color, point.argsData.border, 1,
                            point.labelRegion, dataLabel.rx, dataLabel.ry));
                        appendChildElement(false, datalabelGroup, dataLabelElement, redraw, true, 'x', 'y', startLocation, null,
                                           false, false, null, this.accumulation.duration);
                        let textWidth: number = point.textSize.width;
                        let textHeight: number = point.textSize.height;
                        let rotate: string;
                        if (angle !== 0 && dataLabel.enableRotation) {
                            if (point.labelPosition === 'Outside') {
                                degree = 0;
                            } else {
                                if (point.midAngle >= 90 && point.midAngle <= 270) {
                                    degree = point.midAngle + 180;
                                } else { degree = point.midAngle; }
                            }
                            // tslint:disable-next-line:max-line-length
                            rotate = 'rotate(' + degree + ',' + (location.x + (textWidth / 2)) + ',' + (location.y - (textHeight / 4)) + ')';
                        } else {
                            if (angle) {
                                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                            } else { degree = 0; }
                            rotate = 'rotate(' + degree + ',' + (location.x + (textWidth / 2)) + ',' + (location.y) + ')';
                        }
                        point.transform = rotate;
                        textElement(
                            this.accumulation.renderer,
                            new TextOption(
                                id + 'text_' + point.index, location.x, location.y,
                                'start', point.label, rotate, 'auto', degree
                            ),
                            point.argsData.font, point.argsData.font.color || this.getSaturatedColor(point, point.argsData.color),
                            datalabelGroup, false, redraw, true, false, this.accumulation.duration
                        );
                        element = null;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.accumulation.accumulationLegendModule && (dataLabel.position === 'Outside' || this.accumulation.enableSmartLabels)) {
                        this.accumulation.visibleSeries[0].findMaxBounds(this.accumulation.visibleSeries[0].labelBound, point.labelRegion);
                    }
                    if (point.labelPosition === 'Outside') {
                        let element: Element = getElement(id + 'connector_' + point.index);
                        let previousDirection: string = element ? element.getAttribute('d') : '';
                        let pathElement: Element = this.accumulation.renderer.drawPath(new PathOption(
                            id + 'connector_' + point.index, 'transparent', dataLabel.connectorStyle.width,
                            dataLabel.connectorStyle.color || point.color, 1, dataLabel.connectorStyle.dashArray,
                            this.getConnectorPath(
                                <Rect>extend({}, point.labelRegion, null, true), point, dataLabel, point.labelAngle
                            )
                        ));
                        appendChildElement(false, datalabelGroup, pathElement, redraw, true, null, null, null, previousDirection,
                                           false, false, null, this.accumulation.duration);
                    }
                    appendChildElement(false, parent, datalabelGroup, redraw);
                }
            }
        }
    }

    /**
     * In this method datalabels region checked with legebdBounds and areaBounds.
     * Trimming of datalabel and point's visibility again changed here.
     * @param point current point in which trimming and visibility to be checked
     * @param points finalized points
     * @param dataLabel datalabel model
     */
    private finalizeDatalabels(point: AccPoints, points: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel): void {
        if (this.isOverlapping(point, points) ||
            (this.titleRect && point.labelRegion && isOverlap(point.labelRegion, this.titleRect))) {
            //this.setPointVisibileFalse(point);
        }

        if (this.accumulation.accumulationLegendModule && point.labelVisible && point.labelRegion) {
            let rect: Rect = this.accumulation.accumulationLegendModule.legendBounds;
            let padding: number = this.accumulation.legendSettings.border.width / 2;
            this.textTrimming(
                point, new Rect(rect.x - padding, rect.y - padding, rect.width + (2 * padding), rect.height + (2 * padding)),
                dataLabel.font, this.accumulation.accumulationLegendModule.position);
        }
        if (point.labelVisible && point.labelRegion) {
            let position: string = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';

            this.textTrimming(point, this.areaRect, dataLabel.font, position);
        }
        if (point.labelVisible && point.labelRegion && ((point.labelRegion.y + point.labelRegion.height >
            this.areaRect.y + this.areaRect.height || point.labelRegion.y < this.areaRect.y) || (point.labelRegion.x < this.areaRect.x ||
                point.labelRegion.x + point.labelRegion.width > this.areaRect.x + this.areaRect.width))) {
            this.setPointVisibileFalse(point);
        }
    }

    /**
     * To find the template element size
     * @param element
     * @param point
     * @param argsData
     */
    private getTemplateSize(
        element: HTMLElement, point: AccPoints, argsData: IAccTextRenderEventArgs, redraw: boolean
    ): Size {
        let clientRect: ClientRect;
        element = createTemplate(
            element, point.index, argsData.template, this.accumulation,
            point, this.accumulation.visibleSeries[0], this.accumulation.element.id + '_DataLabel'
        );
        clientRect = measureElementRect(element, redraw);
        return { width: clientRect.width, height: clientRect.height };
    }
    /**
     * To set the template element style
     * @param childElement
     * @param point
     * @param parent
     * @param labelColor
     * @param fill
     */
    private setTemplateStyle(
        childElement: HTMLElement, point: AccPoints, parent: Element,
        labelColor: string, fill: string, redraw?: boolean
    ): void {
        childElement.style.left = (point.labelRegion.x) + 'px';
        childElement.style.top = (point.labelRegion.y) + 'px';
        childElement.style.color = labelColor ||
            this.getSaturatedColor(point, fill);
        if (this.accumulation.isBlazor) {
            let position: string = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';
            if (position === 'InsideRight') {
                childElement.style.transform = 'translate(0%, -50%)';
            } else {
                childElement.style.transform = 'translate(-100%, -50%)';
            }
        }
        if (childElement.childElementCount) {
            appendChildElement(false, parent, childElement, redraw, true, 'left', 'top');
            this.doTemplateAnimation(this.accumulation, childElement);
        }
    }
    /**
     * To find saturated color for datalabel
     */
    private getSaturatedColor(point: AccPoints, color: string): string {
        let saturatedColor: string;
        if (this.marginValue >= 1) {
            saturatedColor = color === 'transparent' ? this.getLabelBackground(point) : color;
        } else {
            saturatedColor = this.getLabelBackground(point);
        }
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        let rgbValue: ColorValue = convertHexToColor(colorNameToHex(saturatedColor));
        let contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    }

    /**
     * Animates the data label template.
     * @return {void}.
     * @private
     */
    public doTemplateAnimation(accumulation: AccumulationChart, element: Element): void {
        let series: AccumulationSeries = accumulation.visibleSeries[0];
        let delay: number = series.animation.delay + series.animation.duration;
        if (series.animation.enable && accumulation.animateSeries) {
            (<HTMLElement>element).style.visibility = 'hidden';
            templateAnimate(element, delay, 200, 'ZoomIn');
        }
    }
    /**
     * To find background color for the datalabel
     */
    private getLabelBackground(point: AccPoints): string {
        return point.labelPosition === 'Outside' ?
            this.accumulation.background || this.accumulation.themeStyle.background : point.color;
    }
    /**
     * To correct the padding between datalabel regions.
     */
    private correctLabelRegion(labelRegion: Rect, textSize: Size, padding: number = 4): void {
        labelRegion.height -= padding;
        labelRegion.width -= padding;
        labelRegion.x += padding / 2;
        labelRegion.y += padding / 2;
        textSize.height -= padding;
        textSize.width -= padding;
    }
    /**
     * To get the dataLabel module name
     */
    protected getModuleName(): string {
        return 'AccumulationDataLabel';
    }

    /**
     * To destroy the data label.
     * @return {void}
     * @private
     */

    public destroy(accumulation: AccumulationChart): void {
        /**
         * Destroy method performed here
         */
    }

    //calculation for placing labels smartly
    private extendedLabelsCalculation(): void {
        let series: AccumulationSeries = <AccumulationSeries>this.accumulation.series[0];
        series.rightSidePoints.forEach((point: AccPoints, index: number, halfSidePoints: AccPoints[]) => {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            this.skipPoints(point, halfSidePoints, index);
        });
        series.leftSidePoints.forEach((point: AccPoints, index: number, halfSidePoints: AccPoints[]) => {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            this.skipPoints(point, halfSidePoints, index);
        });
        this.arrangeLeftSidePoints(series);
        this.isIncreaseAngle = false;
        this.arrangeRightSidePoints(series);
    }

    /**
     * Rightside points alignments calculation
     * @param series 
     */
    private arrangeRightSidePoints(series: AccumulationSeries): void {
        let startFresh: boolean;
        let angleChanged: boolean;
        let rightSideRenderPoints: AccPoints[] = series.rightSidePoints.filter(
            (point: AccPoints) => (point.labelVisible && point.labelPosition === 'Outside'));
        this.rightSideRenderingPoints = rightSideRenderPoints;
        let checkAngle: number;
        let currentPoint: AccPoints;
        let lastPoint: AccPoints = rightSideRenderPoints[rightSideRenderPoints.length - 1];
        let nextPoint: AccPoints;
        if (lastPoint) {
            if (lastPoint.labelAngle > 90 && lastPoint.labelAngle < 270) {
                this.isIncreaseAngle = true;
                this.changeLabelAngle(lastPoint, 89);
            }
        }
        /**
         * Right side points arranged from last point.
         * A point checked with successive points for overlapping. 
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 270, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (let i: number = rightSideRenderPoints.length - 1; i >= 0; i--) {
            currentPoint = rightSideRenderPoints[i];
            nextPoint = rightSideRenderPoints[i + 1];
            // A point checked for overlapping, label visibility
            if (this.isOverlapWithNext(currentPoint, rightSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle <= 90 || currentPoint.labelAngle >= 270)) {
                checkAngle = lastPoint.labelAngle + 10;
                angleChanged = true;
                //If last's point change angle in beyond the limit, stop the increasing angle and do decrease the angle.
                if (startFresh) {
                    this.isIncreaseAngle = false;
                } else if (checkAngle > 90 && checkAngle < 270 && nextPoint.isLabelUpdated) {
                    this.isIncreaseAngle = true;
                }
                if (!this.isIncreaseAngle) {
                    for (let k: number = i + 1; k < rightSideRenderPoints.length; k++) {
                        this.increaseAngle(rightSideRenderPoints[k - 1], rightSideRenderPoints[k], series, true);
                    }
                } else {
                    for (let k: number = i + 1; k > 0; k--) {
                        this.decreaseAngle(rightSideRenderPoints[k], rightSideRenderPoints[k - 1], series, true);
                    }
                }
            } else {
                //If a point did not overlapped with previous points, increase the angle always for right side points.
                if (angleChanged && nextPoint && !nextPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    }

    /**
     * Leftside points alignments calculation
     * @param series 
     */
    private arrangeLeftSidePoints(series: AccumulationSeries): void {
        let leftSideRenderPoints: AccPoints[] = series.leftSidePoints.filter(
            (point: AccPoints) => (point.labelVisible && point.labelPosition === 'Outside'));
        this.leftSideRenderingPoints = leftSideRenderPoints;
        let previousPoint: AccPoints;
        let currentPoint: AccPoints;
        let angleChanged: boolean;
        let startFresh: boolean;
        /**
         * Left side points arranged from first point.
         * A point checked with previous points for overlapping. 
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 90, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (let i: number = 0; i < leftSideRenderPoints.length; i++) {
            currentPoint = leftSideRenderPoints[i];
            previousPoint = leftSideRenderPoints[i - 1];
            // A point checked
            if (this.isOverlapWithPrevious(currentPoint, leftSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle < 270)) {
                angleChanged = true;
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                if (!this.isIncreaseAngle) {
                    for (let k: number = i; k > 0; k--) {
                        this.decreaseAngle(leftSideRenderPoints[k], leftSideRenderPoints[k - 1], series, false);
                        leftSideRenderPoints.filter((point: AccPoints, index: number) => {
                            if (point.isLabelUpdated && leftSideRenderPoints[index].labelAngle - 10 < 100) {
                                this.isIncreaseAngle = true;
                            }
                        });
                    }
                } else {
                    for (let k: number = i; k < leftSideRenderPoints.length; k++) {
                        this.increaseAngle(leftSideRenderPoints[k - 1], leftSideRenderPoints[k], series, false);
                    }
                }
            } else {
                if (angleChanged && previousPoint && previousPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    }

    private decreaseAngle(currentPoint: AccPoints, previousPoint: AccPoints, series: AccumulationSeries, isRightSide: boolean): void {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(previousPoint)) {
            return null;
        }
        let count: number = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                !((previousPoint.labelRegion.height + previousPoint.labelRegion.y) < currentPoint.labelRegion.y))) {
                let newAngle: number = previousPoint.midAngle - count;
                if (newAngle < 0) {
                    newAngle = 360 + newAngle;
                }
                if (newAngle <= 270 && newAngle >= 90) {
                    newAngle = 270;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                count++;
            }
        } else {
            if (currentPoint.labelAngle > 270) {
                this.changeLabelAngle(currentPoint, 270);
                previousPoint.labelAngle = 270;
            }
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                ((currentPoint.labelRegion.y + currentPoint.labelRegion.height) > previousPoint.labelRegion.y))) {
                let newAngle: number = previousPoint.midAngle - count;
                if (!(newAngle <= 270 && newAngle >= 90)) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) &&
                    !series.leftSidePoints.indexOf(previousPoint) && (newAngle - 1 < 90 && newAngle - 1 > 270)) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle + 1);
                    this.arrangeLeftSidePoints(series);
                    break;
                }
                count++;
            }
        }
    }

    private increaseAngle(currentPoint: AccPoints, nextPoint: AccPoints, series: AccumulationSeries, isRightSide: boolean): void {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(nextPoint)) {
            return null;
        }
        let count: number = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                !((currentPoint.labelRegion.y + currentPoint.labelRegion.height) < nextPoint.labelRegion.y))) {
                let newAngle: number = nextPoint.midAngle + count;
                if (newAngle < 270 && newAngle > 90) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) && (newAngle + 1 > 90 && newAngle + 1 < 270) &&
                    this.rightSideRenderingPoints.indexOf(nextPoint) === this.rightSideRenderingPoints.length - 1) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle - 1);
                    nextPoint.labelRegion = nextPoint.initialLabelRegion;
                    this.arrangeRightSidePoints(series);
                    break;
                }
                count++;
            }
        } else {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                (currentPoint.labelRegion.y < (nextPoint.labelRegion.y + nextPoint.labelRegion.height)))) {
                let newAngle: number = nextPoint.midAngle + count;
                if (!(newAngle < 270 && newAngle > 90)) {
                    newAngle = 270;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                count++;
            }
        }
    }

    private changeLabelAngle(currentPoint: AccPoints, newAngle: number): void {
        let dataLabel: AccumulationDataLabelSettingsModel = this.accumulation.series[0].dataLabel;
        let variableR: number;
        if (!this.isVariousRadius()) {
            variableR = this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], currentPoint);
        }

        //padding 10px is added to label radius for increasing the angle and avoid congestion.
        let labelRadius: number = (currentPoint.labelPosition === 'Outside' && this.accumulation.enableSmartLabels &&
            dataLabel.position === 'Inside') ?
            this.radius + stringToNumber(dataLabel.connectorStyle.length || '4%', this.accumulation.pieSeriesModule.size / 2) :
            (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius + 10 : variableR);
        let radius: number = (!this.isVariousRadius() ? labelRadius : variableR);
        this.getLabelRegion(currentPoint, 'Outside', currentPoint.textSize, radius, this.marginValue, newAngle);
        currentPoint.isLabelUpdated = 1;
        currentPoint.labelAngle = newAngle;
    }

    private isOverlapWithPrevious(currentPoint: AccPoints, points: AccPoints[], currentPointIndex?: number): boolean {
        for (let i: number = 0; i < currentPointIndex; i++) {
            if (i !== points.indexOf(currentPoint) &&
                points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    }

    private isOverlapWithNext(point: AccPoints, points: AccPoints[], pointIndex?: number): boolean {
        for (let i: number = pointIndex; i < points.length; i++) {
            if (i !== points.indexOf(point) && points[i].visible && points[i].labelVisible && points[i].labelRegion &&
                point.labelRegion && point.labelVisible && isOverlap(point.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    }


    private skipPoints(currentPoint: AccPoints, halfsidePoints: AccPoints[], pointIndex: number): void {
        if (pointIndex > 0 && ((currentPoint.midAngle < 285 && currentPoint.midAngle > 255) ||
            (currentPoint.midAngle < 105 && currentPoint.midAngle > 75))) {
            let previousPoint: AccPoints = halfsidePoints[pointIndex - 1];
            let angleDiff: number = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            let prevAngleDiff: number = previousPoint.endAngle % 360 - previousPoint.startAngle % 360;
            if (prevAngleDiff <= angleDiff && angleDiff < 5 && previousPoint.labelVisible) {
                this.setPointVisibileFalse(currentPoint);
            }
        } else if (pointIndex > 1 && ((currentPoint.midAngle < 300 && currentPoint.midAngle > 240) ||
            (currentPoint.midAngle < 120 && currentPoint.midAngle > 60))) {
            let prevPoint: AccPoints = halfsidePoints[pointIndex - 1];
            let secondPrevPoint: AccPoints = halfsidePoints[pointIndex - 2];
            let angleDiff: number = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            let prevAngleDiff: number = prevPoint.endAngle % 360 - prevPoint.startAngle % 360;
            let thirdAngleDiff: number = secondPrevPoint.endAngle % 360 - secondPrevPoint.startAngle % 360;
            if (angleDiff < 3 && prevAngleDiff < 3 && thirdAngleDiff < 3 && prevPoint.labelVisible && currentPoint.labelVisible) {
                this.setPointVisibileFalse(currentPoint);
            }
        }
    }

    private getPerpendicularDistance(startPoint: ChartLocation, point: AccPoints): ChartLocation {
        let increasedLocation: ChartLocation;
        let add: number = 10;
        let height: number = add + 10 * Math.sin(point.midAngle * Math.PI / 360);
        if (point.midAngle > 270 && point.midAngle < 360) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((360 - point.midAngle) * Math.PI / 180)),
                                                  startPoint.y - height * (Math.sin((360 - point.midAngle) * Math.PI / 180)));
        } else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((point.midAngle) * Math.PI / 180)),
                                                  startPoint.y + height * (Math.sin((point.midAngle) * Math.PI / 180)));
        } else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 90) * Math.PI / 180)),
                                                  startPoint.y + height * (Math.sin((point.midAngle - 90) * Math.PI / 180)));
        } else {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 180) * Math.PI / 180)),
                                                  startPoint.y - height * (Math.sin((point.midAngle - 180) * Math.PI / 180)));
        }
        return increasedLocation;
    }
}