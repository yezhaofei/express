package com.zf_lab.express.controller;

import com.zf_lab.express.domain.Station;
import com.zf_lab.express.persistance.StationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;


/**
 * The station controller
 */
@Controller
@RequestMapping("pages/station/*")
public class StationController {

    @Autowired
    private StationDAO stationStorage;


    /**
     * this create a new station
     *
     */
    @RequestMapping(value="/create", produces="application/json")
    @ResponseBody
    public int create(@RequestBody Map<String,String> request) {
        String name = request.get("name");
        String loca = request.get("location");
        String desc = request.get("description");

        Station s = new Station(name, loca, desc);
        return stationStorage.saveStation(s);
    }


    @RequestMapping(value="/details", produces="application/json")
	@ResponseBody
	public String details(@RequestBody Map<String,String> request)throws Exception {
		String id = request.get("station");
		int stationId = Integer.parseInt(id);
		Station s = stationStorage.getStation(stationId);
		String str;
		try{
			str = s.toJSON().toString();
		}catch(Exception e){
			e.printStackTrace();
			str = null;
		}
		return str;
	}


    @RequestMapping(value="/delete", produces="application/json")
	@ResponseBody
	public int delete(@RequestBody Map<String, List> request) {
		List ids = request.get("ids");
		System.out.println("try to do delete option, ids:" + ids);
		return stationStorage.deleteStation(ids);
	}


}
