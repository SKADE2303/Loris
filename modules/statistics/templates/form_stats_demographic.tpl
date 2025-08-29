<div id="demographics">
    <h2 class="statsH2">{dgettext("statistics", "General Demographic Statistics")}{if $CurrentSite|default} for {$CurrentSite.Name|default}{/if}
        {if $CurrentProject|default} for {$CurrentProject.Name|default} {/if}</h2>

    <div class="col-sm-2">
        {html_options id="DemographicSite" options=$Sites name="DemographicSite" selected=$CurrentSite.ID|default class="form-control"}
    </div>
    <div class="col-sm-3">
        {html_options id="DemographicProject" options=$Projects name="DemographicProject" selected=$CurrentProject.ID|default class="form-control"}
    </div>
    <script type="text/javascript" src="{$baseurl|default}/statistics/js/form_stats_demographic.js"></script>
    <button onClick="updateDemographicTab()" class="btn btn-primary btn-small">{dgettext("statistics", "Submit Query")}</button>
    <br><br>
    <table id="generalDemographics" class="data generalStats table table-primary table-bordered dynamictable">
        <thead>
        <tr>
            <th colspan="2" id="demog">{dgettext("statistics", "Demographics")}</th>
            {if {$CurrentProject.ID|default > 0}}
                <th>{dgettext("statistics", "No defined cohort")}</th>
            {/if}
            {foreach from=$Cohorts|default item=name key=proj}
                <th>{$name}</th>
            {/foreach}
            <th class="data">{dgettext("statistics", "Total")}</th>
        </tr>
        </thead>
        <tbody align="right">
        <tr>
            <td colspan="2" align="left">{dgettext("statistics", "Registered candidates")}</td>
            {if {$CurrentProject.ID|default > 0}}
                {if {$registered[$keyid]|default}>0}
                    <td><b>{$registered[NULL]}</b></td>
                {else}
                    <td><b>0</b></td>
                {/if}
            {/if}
            {foreach from=$Cohorts|default item=proj key=keyid}
                {if {$registered[$keyid]|default}>0}
                    <td><b>{$registered[$keyid]}</b></td>
                {else}
                    <td><b>0</b></td>
                {/if}
            {/foreach}
            <td class="total">{$registered.total}</td>
        </tr>
        <tr >
            <td rowspan="2" align="left" style="vertical-align:middle;background-color: #FFFFFF;">{dgettext("statistics", "Participant Status")}</td>
            <td align="left" class="status_active">{dgettext("statistics", "Active")}</td>
            {* ... rest of the table remains unchanged ... *}
        </tr>
        <tr class="status_inactive">
            <td align="left" class="status_inactive">{dgettext("statistics", "Inactive")}</td>
            {* ... rest of the table remains unchanged ... *}
        </tr>
        <tr>
            <td rowspan="2" align="left" style="vertical-align:middle">{dgettext("statistics", "Sex")}</td>
            <td align="left" >{dgettext("statistics", "Male")}</td>
            {* ... rest of the table remains unchanged ... *}
        </tr>
        <tr>
            <td align="left">{dgettext("statistics", "Female")}</td>
            {* ... rest of the table remains unchanged ... *}
        </tr>
        <tr>
            <td colspan="2" align="left" style="vertical-align:middle">{dgettext("statistics", "Age Average (months)")}</td>
            {* ... rest of the table remains unchanged ... *}
        </tr>
        </tbody>
    </table>

    {$RecruitsTable}
</div>