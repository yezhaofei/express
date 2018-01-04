package com.zf_lab.express.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *  A simple object storing all User data
 */
public class User implements Serializable {
	

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private List<Integer> stations;
	private String name;
	private String passw;

	private final static String KEYWORD = "stationlist";
	private static final long serialVersionUID = -4254731078227342593L;
	
	public User() {
		this.stations = new ArrayList<>();
		this.name = "";
		this.passw = "";
	}
	
	public User(String name,String passw) {
		this.stations = new ArrayList<>();
		this.name = name;
		this.passw = passw;
	}
	
	public User(int id, String json) throws JSONException {
		this.id = id;
		JSONObject jo = new JSONObject(json);
		this.stations = new ArrayList<>();
		JSONArray jar = jo.getJSONArray(KEYWORD);
		if(jar != null) {
			for(int i = 0; i < jar.length(); i++) {
				this.stations.add(jar.getInt(i));
			}
		} else {

		}
	}
	
	public User(int id, String name, String passw, String json) throws JSONException {
		this(id,json);
		this.name = name;
		this.passw = passw;
	}
	
	public int getId() {
		return id;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getEncodedPassw() {
		return this.passw;
	}

	public void addStation(int id) {
		this.stations.add(id);
	}

	public List<Integer> getStations(){
		return this.stations;
	}

	public void deleteStationsIDs(List<Integer> ids){
		this.stations.removeAll(ids);
        System.out.println("after:" + this.stations);
    }

    private void deleteId(int id) {
        Iterator<Integer> it = this.stations.iterator();
        while(it.hasNext()){
            int oneID = it.next();
            if(oneID == id){
                it.remove();
            }
        }
    }

	public JSONObject stations() throws JSONException {
		JSONObject jo = new JSONObject();
		jo.put(KEYWORD, this.stations);
		return jo;
	}

	@java.lang.Override
	public java.lang.String toString() {
		return "User{" +
				"id=" + id +
				", stations=" + stations +
				", name='" + name + '\'' +
				", passw='" + passw + '\'' +
				'}';
	}


}
