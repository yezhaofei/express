package com.zf_lab.express.persistance;

import com.zf_lab.express.domain.Goods;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GoodsDAO {

    private JdbcTemplate jdbcTemplate;
    private SimpleJdbcInsert inserter;


    // JdbcTemplate setter
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
        this.inserter = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("Goods")
                .usingGeneratedKeyColumns("ID");
    }

    // Saving a new station
    public int saveGoods(Goods g){
        Map<String, Object> parameters = new HashMap<String, Object>(2);
        if (g == null) {
            System.out.println("Goods is null");
            return -1;
        }
        parameters.put("ID", null);
        parameters.put("Date", g.getDate());
        parameters.put("Barcode", g.getBarcode());
        parameters.put("Weight", g.getWeight());
        parameters.put("Station", g.getStation());
        parameters.put("InputWay", g.getInputWay());
        parameters.put("Mark", g.getMark());
        int ret = 0;
        try {
            KeyHolder newId = inserter.executeAndReturnKeyHolder(parameters);
            ret = newId.getKey().intValue();
        }catch (Exception e) {
            System.out.println("saveGoods:" + e.toString());
        }
        return ret;
    }

    public Goods getGoodsRecord(int id) {
        String sql = "select * from Goods where id=?";
        return jdbcTemplate.queryForObject(sql, new Object[] { id }, (ResultSet rs, int rowNum) ->
                new Goods(rs.getInt(1), rs.getTimestamp(2), rs.getString(3), rs.getDouble(4), rs.getString(5), rs.getString(6), rs.getString(7)));
    }

    public JSONArray getGoodsRecords(String station) {
        String sql0 = "select count(*) from Goods where station=?";
        int cnt = jdbcTemplate.queryForObject(sql0, new Object[] { station }, Integer.class);
        if (0 == cnt) return null;

        String sql = "select * from Goods where station=?";
        return jdbcTemplate.queryForObject(sql, new Object[] { station }, (ResultSet rs, int rowNum)-> {
            try {
                JSONArray result = new JSONArray();
                JSONObject record;
                do {
                    record = new JSONObject();
                    record.put("id", Integer.toString(rs.getInt(1)));
                    record.put("date", rs.getTimestamp(2).toString());
                    record.put("barcode", rs.getString(3));
                    record.put("weight", Double.toString(rs.getDouble(4)));
                    record.put("station", rs.getString(5));
                    record.put("inputWay", rs.getString(6));
                    record.put("mark", rs.getString(7));
                    result.put(record);

                } while (rs.next());

                return result;
            }catch(Exception e){
                System.out.println(e.toString());
            }
            return null;
        });
    }


    public int deleteGoods(int id) {
        String sql = "delete from Goods where id=" + id;
        return jdbcTemplate.update(sql);
    }

    public int deleteGoods(List ids) {
        String idsStr = ids.toString().substring(1, ids.toString().length()-1);
        String sql = "delete from Goods where id in ("+idsStr+")";
        return jdbcTemplate.update(sql);
    }


}
