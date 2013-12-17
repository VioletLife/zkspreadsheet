/*

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		2013/12/01 , Created by dennis
}}IS_NOTE

Copyright (C) 2013 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
}}IS_RIGHT
*/
package org.zkoss.zss.ngmodel;

import org.zkoss.zss.ngmodel.chart.NChartData;
import org.zkoss.zss.ngmodel.impl.SheetAdv;
/**
 * 
 * @author dennis
 * @since 3.5.0
 */
public interface NChart {

	public enum NChartType{
		AREA_3D,
		AREA,
		BAR_3D,
		BAR,
		BUBBLE,
		COLUMN,
		COLUMN_3D,
		DOUGHNUT,
		LINE_3D,
		LINE,
		OF_PIE,
		PIE_3D,
		PIE,
		RADAR,
		SCATTER,
		STOCK,
		SURFACE_3D,
		SURFACE
	}
	
	public enum NChartGrouping {
		STANDARD,
		STACKED,
		PERCENT_STACKED,
		CLUSTERED; //bar only
	}
	
	public enum NLegendPosition {
		BOTTOM,
		LEFT,
		RIGHT,
		TOP,
		TOP_RIGHT
	}
	
	public String getId();
	
	public NSheet getSheet();
	
	public NChartType getType();
	
	public NChartData getData();
	
	public NViewAnchor getAnchor();
	
	public String getTitle();
	
	public String getXAxisTitle();
	
	public String getYAxisTitle();

	void setTitle(String title);

	void setXAxisTitle(String xAxisTitle);

	void setYAxisTitle(String yAxisTitle);
	
	public void setLegendPosition(NLegendPosition pos);
	
	public NLegendPosition getLegendPosition();
	
	public void setGrouping(NChartGrouping grouping);
	
	public NChartGrouping getGrouping();
}
