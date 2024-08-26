package com.guolisec.csmp.domain;

import com.guolisec.dp.domain.AssetGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

/**
 * Author Max Lei
 * create 2021-06-04 14:09
 */
@Data
@ApiModel(description = "资产拓扑信息表")
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopoInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Convert(converter = JSONConvert.class)
    @ApiModelProperty(value = "拓扑信息")
    private String information;

    @ManyToMany
    @JoinTable(name = "topo_assetgroup", joinColumns = @JoinColumn(name = "topo_infomation_id"), inverseJoinColumns = @JoinColumn(name = "asset_group_id"))
    private Collection<AssetGroup> assetGroup;

    @ApiModelProperty(value = "拓扑名称")
    private String topoName;

    @CreationTimestamp
    private Date createTime;

    @UpdateTimestamp
    private Date updateTime;

    @ApiModelProperty(value = "主拓扑（拓扑基线）")
    private Boolean mainTopo;

    @ApiModelProperty(value = "拓扑描述")
    private String description;
    @CreatedBy
    private String createBy;
    @LastModifiedBy
    private String updateBy;
}
