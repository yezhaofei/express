package com.zf_lab.express.persistance;

import com.zf_lab.express.domain.User;
import org.json.JSONException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Manages access to USER SQL table
 */
public class UserDAO {

	private JdbcTemplate jdbcTemplate;
	private SimpleJdbcInsert inserter;


	public void setJdbcTemplate(JdbcTemplate jdbcTemplate){
		this.jdbcTemplate = jdbcTemplate;
		this.inserter = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("Users")
                .usingGeneratedKeyColumns("ID");
	}


	public int saveUser(User u) throws DataAccessException, JSONException{
		Map<String, Object> parameters = new HashMap<String, Object>(2);
		parameters.put("ID", null);
		parameters.put("User", u.getName());
		parameters.put("Pwd", u.getEncodedPassw());
		parameters.put("Stations",u.stations().toString());
	    KeyHolder newId = inserter.executeAndReturnKeyHolder(parameters);
	    int ret = newId.getKey().intValue();
	    System.out.println("save user id:" + ret);
        return 1;
	}


	public User getUser(int id) throws SQLException {
		String sql = "select * from Users where id=?";
		return jdbcTemplate.queryForObject(sql, new Object[] { id }, (ResultSet rs, int rowNum) -> {
            User u = null;
            try {
                u = new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4));
            } catch(JSONException e) {
                e.printStackTrace();
            }
            return u;
		});
	}


	public User getUser(String name) throws SQLException,JSONException {
		String sql = "select * from Users where User=?";
		return jdbcTemplate.queryForObject(sql, new Object[]{ name }, (ResultSet rs, int rowNum) -> {
            User u = null;
            try {
                u = new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4));
            } catch(JSONException e) {
                e.printStackTrace();
            } catch(SQLException e) {
                throw new SQLException();
            }
            return u;
        });
	}
	

    public int updateUser(User u) throws DataAccessException, JSONException {
		String sql = "update Users set Stations=? where ID=?";
        return jdbcTemplate.update(sql, new Object[] { u.stations().toString(), u.getId() });
    }


    public boolean checkRepeat(String name) {
        String sql = "select count(*) from Users where User=?";
        if (jdbcTemplate.queryForObject(sql, new Object[] { name }, Integer.class) == 0)
            return false;
        return true;
    }

	
}

