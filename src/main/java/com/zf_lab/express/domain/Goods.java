package com.zf_lab.express.domain;


import org.neo4j.ogm.json.JSONException;
import org.neo4j.ogm.json.JSONObject;

import java.sql.Timestamp;
import java.util.Date;

public class Goods {

    private int id;
    private Timestamp date;
    private String barcode;
    private Double weight;
    private String station;
    private String inputWay;
    private String mark;

    public Goods(String barcode, String station) {
        this.barcode = barcode;
        this.station = station;

        Date rightnow = new Date();
        this.date = new Timestamp(rightnow.getTime());
        this.weight = 0.0;
        this.inputWay = "Machine";
        this.mark = "";
    }

    public Goods(Timestamp date, String barcode, Double weight) {
        this.date = date;
        this.barcode = barcode;
        this.weight = weight;
    }

    public Goods(Timestamp date, String barcode, Double weight, String station, String inputWay) {
        this.date = date;
        this.barcode = barcode;
        this.weight = weight;
        this.station = station;
        this.inputWay = inputWay;
    }

    public Goods(int id, Timestamp date, String barcode, Double weight, String station, String inputWay, String mark) {
        this.id = id;
        this.date = date;
        this.barcode = barcode;
        this.weight = weight;
        this.station = station;
        this.inputWay = inputWay;
        this.mark = mark;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject jo = new JSONObject();
        jo.put("id", this.id);
        jo.put("date",this.date.toString());
        jo.put("barcode", this.barcode);
        jo.put("weight", this.weight.toString());
        jo.put("station", this.station);
        jo.put("inputWay", this.inputWay);
        jo.put("mark", this.mark);
        return jo;
    }


    public String toString() {
        return "id:" + this.id + " date:" + this.date.toString() + " barcode:" + this.barcode +
                " weight:" + this.weight + " station:" + this.station + " inputWay:" + this.inputWay +
                " mark:" + this.mark;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getStation() {
        return station;
    }

    public void setStation(String station) {
        this.station = station;
    }

    public String getInputWay() {
        return inputWay;
    }

    public void setInputWay(String inputWay) {
        this.inputWay = inputWay;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }
}
