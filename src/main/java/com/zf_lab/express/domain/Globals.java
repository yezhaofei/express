package com.zf_lab.express.domain;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;


public class Globals {

	public static final SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss a", Locale.ENGLISH);

	
	public static Date stringToDate(String str, SimpleDateFormat sdf) {
		Date date = null;
		try {
			date = sdf.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}


	public static Timestamp stringToTimestamp(String str, SimpleDateFormat sdf) {
		return new Timestamp(stringToDate(str, sdf).getTime());
	}


	public static String longToDatestring(long time, SimpleDateFormat sdf) {
        Date date = new Date();
        date.setTime(time);
        return sdf.format(date);
    }


}
