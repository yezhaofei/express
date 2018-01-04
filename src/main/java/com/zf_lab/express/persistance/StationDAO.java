package com.zf_lab.express.persistance;

import com.zf_lab.express.domain.Station;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StationDAO {

    private JdbcTemplate jdbcTemplate;
    private SimpleJdbcInsert inserter;


    public void setJdbcTemplate(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
        this.inserter = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("Stations")
                .usingGeneratedKeyColumns("ID");
    }


    public int saveStation(Station s){
        Map<String, Object> parameters = new HashMap<String, Object>(2);
        parameters.put("ID", null);
        parameters.put("Station", s.getStationName());
        parameters.put("Location", s.getLocation());
        parameters.put("Description", s.getDescription());
        int ret = 0;
        try {
            KeyHolder newId = inserter.executeAndReturnKeyHolder(parameters);
            ret = newId.getKey().intValue();
        }catch (Exception e) {
            System.out.println(e.toString());
        }
        return ret;
    }


    public String getStationName(int id) {
        String sql = "select station from Stations where id=" + id;
        return jdbcTemplate.queryForObject(sql, String.class);
    }

    public Station getStation(int id) {
        String sql = "select * from Stations where id=?";
        return jdbcTemplate.queryForObject(sql, new Object[] { id }, (ResultSet rs, int rowNum) ->
                new Station(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4)));
    }


    public int deleteStation(List ids) {
        System.out.println("ids:" + ids);
        String idsStr = ids.toString().substring(1, ids.toString().length()-1);
        System.out.println("idsStr:" + idsStr);
        String sql = "delete from Stations where id in ("+idsStr+")";
        System.out.println("sql:" + sql);
        return jdbcTemplate.update(sql);
    }


}
