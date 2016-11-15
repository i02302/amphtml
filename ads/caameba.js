/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {loadScript, validateData} from '../3p/3p';

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function caameba(global, data) {

    validateData(
        data
        , []
        , ['ad-spot'
            , 'format'
            , 'test'
            , 'optout'
            , 'offset'
            , 'ipv4'
            , 'ipv6'
            , 'network-reachability'
            , 'os-name'
            , 'os-version'
            , 'os-lang'
            , 'os-timezone'
            , 'device-version'
            , 'app-id'
            , 'app-version'
            , 'kv'
            , 'uid'
            , 'muid'
        ]
    );
        
    loadScript(global, 'https://cdn.amanad.adtdp.com/sdk/ajaamp-v1.0.js', () => {

        ajaamp({
            ad_spot: data.adSpot,
            count: 1,
            test_flag: data.test,
            optout: data.optout,
            ipv4: data.ipv4,
            ipv6: data.ipv6,
            network_reachability: data.networkReachability,
            os_name: data.osName,
            os_version: data.osVersion,
            os_lang: data.osLang,
            os_timezone: data.osTimezone,
            device_version: data.deviceVersion,
            app_id: data.appId,
            app_version: data.appVersion,
            kv: data.kv,
            uid: data.uid
        }, function (err) {
            if (err) {
                console.warn("aja-amp-ad response has some error", err);
                return;
            }
        });
    
    });

}
