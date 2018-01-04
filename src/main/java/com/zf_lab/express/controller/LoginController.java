package com.zf_lab.express.controller;

import com.zf_lab.express.domain.User;
import com.zf_lab.express.persistance.UserDAO;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.Map;


/**
 * The Login controller
 */
@Controller  
@RequestMapping("pages/login/*") 
public class LoginController {
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private UserDAO userstorage;
	
	/**
	 * this method verifies the username and password 
	 * @param request the key-value of the username and password
	 * @return the result of verification as a boolean
	 */
	@RequestMapping(value="/verify", produces="application/json") 
	@ResponseBody
	public String verify(@RequestBody Map<String,String> request, HttpSession session) {
		JSONObject jsonObj;
		boolean flag;
		String sessionId;
		String username=request.get("username");
		String password=request.get("password");
		User u;
		try {
			u = userstorage.getUser(username);
		} catch (Exception e) {
			return null; // user not found
		}
		flag = bCryptPasswordEncoder.matches(password,u.getEncodedPassw());
		sessionId = session.getId();
		try {
			jsonObj = new JSONObject();
			if(sessionId != null){
				jsonObj.put("sessionId",sessionId);
				jsonObj.put("checkFlag",flag);
				jsonObj.put("userName",username);
			}else{
				jsonObj = null;
			}
		} catch (JSONException e) {
			e.printStackTrace();
			jsonObj = null;
		}
		return jsonObj.toString();
	}


	@RequestMapping(value="/isSession", produces="application/json")
	@ResponseBody
	public boolean isSession(@RequestBody Map<String,String> request,HttpSession session){
		String sessionIdPrevious = request.get("username");
		boolean flag = false;
		String sessionIdCurrent =  session.getId();
		if(sessionIdPrevious.equals(sessionIdCurrent)){
			flag = true;
		}
		return flag;
	}


	@RequestMapping(value="/logOutSession", produces="application/json")
	@ResponseBody
	public boolean logOutSession(@RequestBody Map<String,String> request,HttpSession session){
		String sessionIdPrevious = request.get("sessionId");
		boolean flag;
		String sessionIdCurrent =  session.getId();
		if(sessionIdPrevious.equals(sessionIdCurrent)){
			session.invalidate();
			flag = true;
		}else{
			flag = false;
		}
		return flag;
	}


}
