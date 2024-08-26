package com.guolisec.csmp.query;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Collection;

/**
 * @Author Max Lei
 * @Date :2022/3/22 9:49
 */
@Data
public class TopoQuery {
    @ApiModelProperty(value = "拓扑图的数据，一个长json字符串")
    private String information;
    @ApiModelProperty(value = "拓扑描述")
    private String description;
    private Collection<Integer> assetGroupIds;
    private String topoName;
    private Boolean mainTopo;
    @ApiModelProperty(value = "新建自")
    private Long sourceTopoId;
}
