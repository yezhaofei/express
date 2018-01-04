package com.zf_lab.express.controller;


import com.zf_lab.express.persistance.VisualizeDAO;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;


@Controller
@RequestMapping("pages/visual/*")
public class VisualizeController {

    @Autowired
    private VisualizeDAO visualstorage;

    @RequestMapping(value="/template", produces="application/json")
    @ResponseBody
    public int template(@RequestBody Map<String,String> request) throws JSONException {
        return 0;
    }


}
