package com.zf_lab.express.persistance;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;


public class VisualizeDAO {

    private JdbcTemplate jdbcTemplate;
    private SimpleJdbcInsert inserter;


    public void setJdbcTemplate(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
        this.inserter = new SimpleJdbcInsert(jdbcTemplate)
                .withTableName("Trendconfigs")
                .usingGeneratedKeyColumns("ID");
    }


}
