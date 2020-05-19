/*
 * Copyright 2018-2020 TON DEV SOLUTIONS LTD.
 *
 * Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at:
 *
 * http://www.ton.dev/licenses
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific TON DEV software governing permissions and
 * limitations under the License.
 */

import {TONClient} from '../index.js'
import {bv} from '../binaries';

require('dotenv').config();

test("Binaries", async () => {
    const client = await TONClient.create({ servers: [] });
    const version = await client.config.getVersion();
    console.log(`version: ${version}`)
    if (process.env.BINARIES_VERSION) {
        expect(version)
            .toEqual(process.env.BINARIES_VERSION);
    } else {
        expect(version.split('.')[0])
            .toEqual(bv);
    }
});

