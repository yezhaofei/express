package com.zf_lab.express.domain;

import org.neo4j.ogm.json.JSONException;
import org.neo4j.ogm.json.JSONObject;

public class Station {

    public Station(String stationName, String location, String description) {
        this.stationName = stationName;
        this.location = location;
        this.description = description;
    }

    public Station(int id, String stationName, String location, String description) {
        this.stationName = stationName;
        this.location = location;
        this.description = description;
        this.id = id;
    }


    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject jo = new JSONObject();
        jo.put("id", this.id);
        jo.put("name",this.stationName);
        jo.put("location", this.location);
        jo.put("description", this.description);
        return jo;
    }

    @Override
    public int hashCode()
    {
        return this.stationName.hashCode();
    }

    @Override
    public boolean equals(Object o)
    {
        return this.stationName.equals(o);
    }

    private String stationName;
    private String location;
    private String description;
    private int id;


}
