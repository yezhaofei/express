package com.zf_lab.express.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;


@Controller
@RequestMapping("pages/option/*")
public class OptionController {


    @RequestMapping(value = "/option", produces = "application/json")
    @ResponseBody
    public String someMethod(@RequestBody Map<String, String> request) throws Exception {
        return null;
    }


}
