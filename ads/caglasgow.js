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
export function caglasgow(global, data) {

    // 属性バリデーション
    validateData(
        data
        // 必須項目
        , []
        // 任意項目
        , ['ad-spot'
            , 'format'
            , 'count'
            , 'test'
            , 'optout'
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
        ]
    );

    loadScript(global, 'https://stg-cdn.amanad.adtdp.com/sdk/amn-v1.2.1.js', () => {

        amn('create');

    // TODO: ここらへんのIF変更でPR出し直すのめんどいから、loadScriptのcallback内容もSDKに含めてしまう...と思ったけど、結局↑でバリデーション入れてるから同じかな
    // TODO: パラメタの受け渡しもっと雑にしておいたほうが後々幸せになりそうである
    amn('ad',
        {
            ad_spot: data.adSpot,
            count: data.count,
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
        },
        function (err, data) {

            if (err) {
                console.warn("ad response has some error", err);
                return;
            }

            data.ads.forEach(function (ad) {

                amn('render', ad, function (err, element) {

                    if (err) {
                        console.warn(err, err.data);
                        // TODO: エラーになったら自分でレンダリング（必要?AMPの場合はテンプレート必須にしたほうが良い気がする）
                        return;
                    }

                    // clickイベント拾ったり、a要素で囲ったり。
                    element.addEventListener('click', function () {
                        location.assign(ad.click_url);
                        // TODO: iframe内部で遷移するので、target=_blank つけてあげる
                    });

                    // レンダリング
                    // FIXME: impとinview発火するようになってるけど、impはうまくいくけど、inviewはiframe対応してないからうまくいかない
                    // FIXME: AMPの場合は、SDKじゃなくて `amp-analytics` 使ったほうが楽かもしれない(検証中)
                    document.getElementById('c').appendChild(element);

                });

                // inview
                var inview = true;
                window.context.observeIntersection(function(changes) {
                    changes.forEach(function(c) {
                        if (c.intersectionRect.height > 0 && inview)  {
                            amn('inview', ad);
                            inview = false;
                        }
                    });
                });

            });

        });
    
    });

}
