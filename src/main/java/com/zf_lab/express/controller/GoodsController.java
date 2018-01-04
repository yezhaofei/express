package com.zf_lab.express.controller;


import com.zf_lab.express.domain.Goods;
import com.zf_lab.express.persistance.GoodsDAO;
import com.zf_lab.express.persistance.StationDAO;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * The Goods controller
 */
@Controller
@RequestMapping("pages/goods/*")
public class GoodsController {

    @Autowired
    private GoodsDAO goodsStorage;

    @Autowired
    private StationDAO stationStorage;


    @RequestMapping(value="/getGoodsRecord", produces="application/json")
    @ResponseBody
    public String getGoodsRecord(@RequestBody Map<String, String> request) throws Exception {
        String idStr = request.get("goodsId");
        int id = Integer.parseInt(idStr);
        Goods g = goodsStorage.getGoodsRecord(id);
        String str;
        try{
            str = g.toJSON().toString();
        }catch(Exception e){
            e.printStackTrace();
            str = null;
        }
        return str;
    }


    @RequestMapping(value="/getGoodsRecords", produces="application/json")
    @ResponseBody
    public String getGoodsRecords(@RequestBody Map<String, String> request) {
        Integer stationId;
        try {
            stationId = Integer.parseInt(request.get("stationId"));
        }catch (Exception e) {
            System.out.println("getGoodsRecords, request.get(\"stationId\"):" + e.toString());
            return null;
        }

        String station = stationStorage.getStationName(stationId);
        System.out.println("get goods records, request station is:" + station);
        JSONArray goodsRecords = goodsStorage.getGoodsRecords(station);
        if (goodsRecords == null) return "N";
        return goodsRecords.toString();
    }


    @RequestMapping(value="/delete", produces="application/json")
    @ResponseBody
    public int delete(@RequestBody Map<String, List> request) {
        List ids = request.get("ids");
        return goodsStorage.deleteGoods(ids);
    }

}
