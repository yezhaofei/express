package com.zf_lab.express.controller;

import com.zf_lab.express.domain.User;
import com.zf_lab.express.persistance.UserDAO;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * The User controller
 */
@Controller  
@RequestMapping("pages/user/*") 
public class UserController {

	@Autowired
	private UserDAO userstorage;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	/**
	 * this returns the sites associated with a user
	 * @throws JSONException 
	 * 
	 */
	@RequestMapping(value="/create", produces="application/json") 
	@ResponseBody
	public int createUser(@RequestBody Map<String,String> request) throws JSONException {
		String userName = request.get("name");
		String userPwd = request.get("passw");

		if (userstorage.checkRepeat(userName)) {
		    System.out.println("User is existed!");
            return 0;
        }

		User u = new User(userName, bCryptPasswordEncoder.encode(userPwd));
		return userstorage.saveUser(u);
	}
	

	/**
	 * this returns the sites associated with a user
	 * @throws JSONException 
	 * @throws SQLException 
	 * 
	 */
	@RequestMapping(value="/stations", produces="application/json")
	@ResponseBody
	public String getStations(@RequestBody Map<String,String> request) throws JSONException, SQLException {
		String username = request.get("name");
		User u = userstorage.getUser(username);
		return u.stations().toString();
	}


	/**
	 * Add a site to user
	 * @throws JSONException 
	 * @throws DataAccessException 
	 * @throws SQLException 
	 */
	@RequestMapping(value="/addStation", produces="application/json")
	@ResponseBody
	public int addStation(@RequestBody Map<String,String> request) throws DataAccessException, JSONException, SQLException {
		String username = request.get("name");
		User u = userstorage.getUser(username);
		String id = request.get("station");
		int stationid = Integer.parseInt(id);
		int ret = 0;
		try {
			u.addStation(stationid);
			userstorage.updateUser(u);
			ret = 1;
		}catch (Exception e) {
			System.out.println(e.toString());
		}
		return ret;
	}


	/**
	 * delete site to user
	 * @throws JSONException
	 * @throws DataAccessException
	 * @throws SQLException 
	 */
	@RequestMapping(value="/deleteStationID", produces="application/json")
	@ResponseBody
	public int deleteStationID(@RequestBody Map<String, String> request) throws DataAccessException, JSONException, SQLException {
		String username = request.get("userName");
		User u = userstorage.getUser(username);

		String idsStr = request.get("ids");
        JSONArray jar;
		try {
		    jar = new JSONArray(idsStr);
        }catch (Exception e) {
		    System.out.println("deleteStationID 1:" + e.toString());
		    return 0;
        }

        List<Integer> ids = new ArrayList<>();
        for (int i=0; i<jar.length(); ++i) {
		    ids.add(jar.getInt(i));
        }

		int ret = 0;
		try {
			u.deleteStationsIDs(ids);
			userstorage.updateUser(u);
			ret = 1;
		}catch (Exception e) {
			System.out.println(e.toString());
		}
		return ret;
	}

	
}
