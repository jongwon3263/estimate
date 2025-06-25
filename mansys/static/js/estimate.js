document.addEventListener('DOMContentLoaded', function () {
    const roomTypeSelect = document.getElementById('selectRoomType');
    const selectedRoomTypeId = roomTypeSelect.value;
    const inputPyeongDiv = document.getElementById('inputPyeong');
    const smallTypeDiv = document.getElementById('smallType');
    const pyeong = document.getElementById('pyeong');
    const pyeongValue = parseFloat(document.getElementById('pyeong').value) || 0;
    function getPyeongValue() {
        return parseFloat(document.getElementById('pyeong').value) || 0;
    }
    const smallRoomTypeSelector = document.getElementById('smallRoomTypeSelector');

    //시공 선택 체크박스
    const checkCleaning = document.getElementById('checkCleaning');
    const checkGrouting = document.getElementById('checkGrouting');
    const checkKera = document.getElementById('checkKera');
    const checkNewhouse = document.getElementById('checkNewhouse');
    const checkPainting = document.getElementById('checkPainting');
    const checkCoating = document.getElementById('checkCoating');
    const checkFloorCoating = document.getElementById('checkFloorCoating');
    const checkAppliance = document.getElementById('checkAppliance');
    
    //시공별 컨테이너
    const cleaningContainer = document.getElementById('cleaning-container');
    const groutContainer = document.getElementById('grouting-container');
    const keraContainer = document.getElementById('kera-container');
    const newhouseContainer = document.getElementById('newhouse-container');
    const paintContainer = document.getElementById('paint-container');
    const coatingContainer = document.getElementById('coating-container');
    const floorCoatingContainer = document.getElementById('floorCoating-container');

    //시공별 금액
    const cleaningPriceDiv = document.getElementById('cleaningPrice');
    //줄눈
    const groutPriceFloor = document.getElementById('groutPriceFloor');
    const groutPriceWall = document.getElementById('groutPriceWall');
    const groutPriceSilicone = document.getElementById('groutPriceSilicone');
    const groutPriceTotal = document.getElementById('groutPriceTotal');
    //케라
    const keraPriceFloor = document.getElementById('keraPriceFloor');
    const keraPriceWall = document.getElementById('keraPriceWall');
    const keraPriceTotal = document.getElementById('keraPriceTotal');
    //새집
    const newhousePrice = document.getElementById('newhousePrice');
    //탄성
    const paintPrice = document.getElementById('paintPrice');
    //마루코팅
    const floorCoatingPrice = document.getElementById('floorCoatingPrice');
    //코팅
    const coatingPriceCountertop = document.getElementById('coatingPriceCountertop');
    const coatingPriceNano = document.getElementById('coatingPriceNano');
    const coatingPriceFloorTile = document.getElementById('coatingPriceFloorTile');
    const coatingPriceWallTile = document.getElementById('coatingPriceWallTile');
    const coatingPriceTotal = document.getElementById('coatingPriceTotal');
    //가전
    const airconPrice = document.getElementById('apAirconPrice');
    const washingmachinePrice = document.getElementById('apWashingmachinePrice');
    const apPrice = document.getElementById('apPrice');






    //체크박스 체크 여부에 따른 옆 체크박스 비활성화
    const pairs = [
        ['gr_1_1', 'gr_1_2'],
        ['gr_1_7', 'gr_1_8'],
        ['gr_2_1', 'gr_2_2'],
        ['gr_3_3', 'gr_3_4'],
        ['kp_1_8', 'kp_1_9'],
        ['ct_1_1', 'ct_1_2'],
        ['ct_2_1', 'ct_2_2'],
        ['ct_3_1', 'ct_3_2'],
        ['ct_4_3', 'ct_4_4'],
        ['kp_2_1', 'kp_2_2'],
        ['kp_1_2', 'kp_1_3'],
    ];



    pairs.forEach(([id1, id2]) => {
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);

        el1.addEventListener('change', () => el2.disabled = el1.checked);
        el2.addEventListener('change', () => el1.disabled = el2.checked);
    });

    //서버 관련 변수


    // 집 구조 선택
    roomTypeSelect.addEventListener('change', function () {
        const selected = roomTypeSelect.value;
        
        if (selected === 'normalType') {
            inputPyeongDiv.classList.remove('hide');
            smallTypeDiv.classList.add('hide');
        } else if (selected === 'smallType') {
            pyeong.value = '';
            smallTypeDiv.classList.remove('hide');
            inputPyeongDiv.classList.add('hide');
        } else  {
            pyeong.value = '';
            inputPyeongDiv.classList.add('hide');
            smallTypeDiv.classList.add('hide');
        }
    });

    //청소 가격 표시
    checkCleaning.addEventListener('change', function (event) {
        
        if (!cleaningContainer) {
            console.warn('❗️cleaning-container를 찾을 수 없습니다.');
            return;
        }

        const isChecked = event.target.checked;

        if (isChecked) {
            cleaningContainer.classList.remove('hide');
        } else {
            cleaningPriceDiv.textContent = '';
            cleaningContainer.classList.add('hide');
        }

        

        if (!isChecked) {
            cleaningPriceDiv.textContent = '';
            return;
        }

        if (roomTypeSelect.value === 'normalType' && !isNaN(pyeongValue)) {
            fetch('/api/get_price?service_id=CL&option_id=1')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const total = data.price * getPyeongValue();
                        cleaningPriceDiv.textContent = `${total.toLocaleString()}원`;
                        final();
                    } else {
                        cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                });

        } else if (roomTypeSelect.value === 'smallType') {
            const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
            if (selectedOption && selectedOption.value !== "") {
                const parts = selectedOption.id.split('_'); 
                const serviceId = parts[0];          
                const categoryCode = parts[1];    
                const optionCode = parts[2];      
                console.log(serviceId, categoryCode, optionCode);

                fetch(`/api/get_price?service_id=CL&category_code=${categoryCode}&option_code=${optionCode}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            cleaningPriceDiv.textContent = `${data.price.toLocaleString()}원`;
                            final();
                        } else {
                            cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                        }
                    })
                    .catch(err => {
                        console.error('요청 오류:', err);
                        cleaningPriceDiv.textContent = '서버 오류 발생';
                    });
                } else {
                    cleaningPriceDiv.textContent = '구조를 선택해주세요.';
                }
        } else {
            cleaningPriceDiv.textContent = '';
        }
    });


    // 방 구조 후선택
    smallRoomTypeSelector.addEventListener('change', function () {
        const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
        const selectedId = selectedOption.id;
        console.log('룸 id:', selectedId);
        

        if (checkCleaning.checked && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];          
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=CL&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        cleaningPriceDiv.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(err => {
                    console.error('요청 오류:', err);
                    cleaningPriceDiv.textContent = '서버 오류 발생';
                });
            } else {
                cleaningPriceDiv.textContent = '';
            }
        
        if (checkNewhouse.checked && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];          
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=NH&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        newhousePrice.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(error => {
                    console.error('가격 요청 오류:', error);
                    newhousePrice.textContent = '서버 오류 발생';
                });
            } else {
                newhousePrice.textContent = '';
            }

    });


    // 새집증후군
    
    if (checkNewhouse) {
        checkNewhouse.addEventListener('change', function (event) {
            const isChecked = event.target.checked;

            if (isChecked) {
                newhouseContainer.classList.remove('hide');
                const pyeong = parseFloat(document.getElementById('pyeong').value) || 0;
                
                // 집 구조가 일반 평수일 때만 가격 계산
                if (roomTypeSelect.value === 'normalType') {
                    fetch(`/api/get_price?service_id=NH&category_code=1&option_code=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                const total = data.price * pyeong;
                                newhousePrice.textContent = `${total.toLocaleString()}원`;
                                final();
                            } else {
                                newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                            }
                        })
                        .catch(error => {
                            console.error('가격 요청 오류:', error);
                            newhousePrice.textContent = '서버 오류 발생';
                        });
                } else if (roomTypeSelect.value === 'smallType') {
                    const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
                    if (selectedOption && selectedOption.value !== "") {
                        const parts = selectedOption.id.split('_'); 
                        const serviceId = parts[0];          
                        const categoryCode = parts[1];    
                        const optionCode = parts[2];      
                        console.log(serviceId, categoryCode, optionCode);

                        fetch(`/api/get_price?service_id=NH&option_code=${optionCode}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    newhousePrice.textContent = `${data.price.toLocaleString()}원`;
                                    final();
                                } else {
                                    newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                                }
                            })
                            .catch(error => {
                                console.error('가격 요청 오류:', error);
                                newhousePrice.textContent = '서버 오류 발생';
                            });
                        } else {
                            newhousePrice.textContent = '구조를 선택해주세요.';
                        }
                }
            } else {
                newhouseContainer.classList.add('hide');
                newhousePrice.textContent = '';
            }
        });
    }


    //줄눈시공
    //컨테이너 보이기

    if(checkGrouting && groutContainer) {
        checkGrouting.addEventListener('change', function(event){
            const isChecked = event.target.checked;
            // console.log('✅ 줄눈시공 체크 상태:', isChecked);
            if(isChecked) {
                groutContainer.classList.remove('hide');
            } else {
                groutContainer.classList.add('hide');
            }
        })
    } else {
        console.warn('❗️checkGrouting 또는 grouting-container 요소를 찾지 못했습니다.');
    }

    //바닥, 벽, 실리콘 줄눈 계산
    const grCheckboxes = document.querySelectorAll('.gr_checkbox');

    grCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateGroutPrice);
    });

    async function updateGroutPrice() {
        let floorTotal = 0;
        let wallTotal = 0;
        let siliconeTotal = 0;

        for (const checkbox of grCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = serviceId.toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];
                console.log(checkbox.id);
                try {
                    const response = await fetch (`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`);
                    const data = await response.json();
                    if (data.success) {
                        if (checkbox.id == 'gr_1_7' || checkbox.id == 'gr_1_8') {
                            floorTotal += data.price * getPyeongValue();
                        } else if (categoryCode == '1') {
                            floorTotal += data.price;
                        } else if (categoryCode == '2') {
                            wallTotal += data.price;
                        } else if (categoryCode == '3') {
                            siliconeTotal += data.price;
                        }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const groutTotal = floorTotal + wallTotal + siliconeTotal;
        
        
        groutPriceFloor.textContent = floorTotal > 0 ? `${floorTotal.toLocaleString()}원` : '0원';
        groutPriceWall.textContent = wallTotal > 0 ? `${wallTotal.toLocaleString()}원` : '0원';
        groutPriceSilicone.textContent = wallTotal > 0 ? `${siliconeTotal.toLocaleString()}원` : '0원';
        groutPriceTotal.textContent = groutTotal > 0 ? `토탈 ${groutTotal.toLocaleString()}원` : '0원';
        final();
    }


    //케라폭시
    //컨테이너 보이기
    if(checkKera && keraContainer) {
        checkKera.addEventListener('change', function(event){
            const isChecked = event.target.checked;
            // console.log('✅ 줄눈시공 체크 상태:', isChecked);
            if(isChecked) {
                keraContainer.classList.remove('hide');
            } else {
                keraContainer.classList.add('hide');
            }
        })
    } else {
        console.warn('checkKera 또는 kera-container 요소를 찾지 못했습니다.');
    }

    //바닥, 벽 케라 계산
    const kpCheckboxes = document.querySelectorAll('.kp_checkbox');


    kpCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateKeraPrice);
    });

    async function updateKeraPrice() {
        let floorTotal = 0;
        let wallTotal = 0;

        const pyeong = parseFloat(document.getElementById('pyeong').value) || 0;

        for (const checkbox of kpCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = parts[0].toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];
                try {
                    const response = await fetch (`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`);
                    const data = await response.json();
                    if (data.success) {

                        const price = (checkbox.id === `${serviceId}_1_7` || checkbox.id === `${serviceId}_1_8`)
                            ? data.price * pyeong
                            : data.price;
                        if (categoryCode == '1') {
                            floorTotal += price;
                        } else if (categoryCode == '2') {
                            wallTotal += price;
                        }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const keraTotal = floorTotal + wallTotal;
        
        
        keraPriceFloor.textContent = floorTotal > 0 ? `${floorTotal.toLocaleString()}원` : '0원';
        keraPriceWall.textContent = wallTotal > 0 ? `${wallTotal.toLocaleString()}원` : '0원';
        keraPriceTotal.textContent = keraTotal > 0 ? `토탈 ${keraTotal.toLocaleString()}원` : '0원';
        final();
    }

    //생활코팅
    
    checkCoating.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if (isChecked) {
            coatingContainer.classList.remove('hide');
        } else {
            coatingContainer.classList.add('hide');
        }
    })

    //코팅 가격 계산
    const ctCheckboxes = document.querySelectorAll('.ct_checkbox');


    ctCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCoatingPrice);
    });

    async function updateCoatingPrice() {
        let countertopTotal = 0;
        let nanoTotal = 0;
        let floorTileTotal = 0;
        let wallTileTotal = 0;


        for (const checkbox of ctCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = serviceId.toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];
                console.log(serviceIdUpper, categoryCode, optionCode);
                try {
                    const url = `/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`;
                    const response = await fetch (url);
                    console.log('요청 URL:', url);
                    const data = await response.json();
                    if (data.success) {

                        if (categoryCode == '1') {
                            countertopTotal += data.price;
                        } else if (categoryCode == '2') {
                            nanoTotal += data.price;
                        } else if (categoryCode == '4') {
                            wallTileTotal += data.price;
                        } else if (categoryCode === '3' && optionCode === '3') {
                            floorTileTotal += data.price * getPyeongValue();
                        } else if (categoryCode === '3') {
                            floorTileTotal += data.price ;
                        }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const coatingTotal = countertopTotal + nanoTotal + floorTileTotal + wallTileTotal;
        
        
        coatingPriceCountertop.textContent = countertopTotal > 0 ? `${countertopTotal.toLocaleString()}원` : '0원';
        coatingPriceNano.textContent = nanoTotal > 0 ? `${nanoTotal.toLocaleString()}원` : '0원';
        coatingPriceFloorTile.textContent = floorTileTotal > 0 ? `${floorTileTotal.toLocaleString()}원` : '0원';
        coatingPriceWallTile.textContent = wallTileTotal > 0 ? `${wallTileTotal.toLocaleString()}원` : '0원';
        coatingPriceTotal.textContent = coatingTotal > 0 ? `토탈 ${coatingTotal.toLocaleString()}원` : '0원';
        final();
    }

    
    //탄성코트
    const paintOptionSelector = document.getElementById('paintOptionSelector');
    
    //탄성코트 컨테이너 보이기
    checkPainting.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            paintContainer.classList.remove('hide');
        } else {
            paintPrice.textContent = '';
            paintContainer.classList.add('hide');
        }
    })

    // 탄성코트 가격 표시
    paintOptionSelector.addEventListener('change', function () {
        
        const selectedValue = paintOptionSelector.value;

        if (!checkPainting.checked) {
            paintPrice.textContent = '';
            return;
        }

        if (!selectedValue) {
            paintPrice.textContent = '';
            return;
        }
        const selectedOption = paintOptionSelector.options[paintOptionSelector.selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];
            const serviceIdUpper = serviceId.toUpperCase();
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceIdUpper, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        paintPrice.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        paintPrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(err => {
                    console.error('요청 오류:', err);
                    paintPrice.textContent = '서버 오류 발생';
                });
        }

    });


    //마루코팅
    const floorCoatingOptionSelector = document.getElementById('floorCoatingOptionSelector');
    
    //마루코팅 컨테이너 보이기
    checkFloorCoating.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            floorCoatingContainer.classList.remove('hide');
        } else {
            floorCoatingPrice.textContent = '';
            floorCoatingContainer.classList.add('hide');
        }
    })

    // 마루코팅 가격 표시
    floorCoatingOptionSelector.addEventListener('change', function () {
        const selectedOption = floorCoatingOptionSelector.options[floorCoatingOptionSelector.selectedIndex];
        const selectedValue = floorCoatingOptionSelector.value;

        if (!checkFloorCoating.checked) {
            floorCoatingPrice.textContent = '';
            return;
        }

        if (!selectedValue) {
            floorCoatingPrice.textContent = '';
            return;
        }
        if (selectedOption && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0].toUpperCase();
            const serviceIdUpper = serviceId.toUpperCase();
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const price = data.price * getPyeongValue();
                        floorCoatingPrice.textContent = `${price.toLocaleString()}원`;
                        final();
                    } else {
                        floorCoatingPrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(error => {
                    console.error('가격 요청 오류:', error);
                    floorCoatingPrice.textContent = '서버 오류 발생';
                });
        } else {
            floorCoatingPrice.textContent = '구조를 선택해주세요.';
        }

    });

    //가전분해청소

    //컨테이너 보이기
    checkAppliance.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            document.getElementById('appliances-container').classList.remove('hide');
        } else {
            airconPrice.textContent = '';
            washingmachinePrice.textContent = '';
            apPrice.textContent = '';
            document.getElementById('appliances-container').classList.add('hide');
        }
    })

    const apItems = [
        { checkboxId: 'check_ap_1_1', inputId: 'price_ap_1_1' },
        { checkboxId: 'check_ap_1_2', inputId: 'price_ap_1_2' },
        { checkboxId: 'check_ap_1_3', inputId: 'price_ap_1_3' },
        { checkboxId: 'check_ap_2_1', inputId: 'price_ap_2_1' },
        { checkboxId: 'check_ap_2_2', inputId: 'price_ap_2_2' },
        { checkboxId: 'check_ap_2_3', inputId: 'price_ap_2_3' },
    ];

    function updateApPrices() {
        let aircon = 0;
        let washingmachine = 0;

        apItems.forEach(item => {
            const checkbox = document.getElementById(item.checkboxId);
            const input = document.getElementById(item.inputId);
            const value = parseInt(input.value) || 0;

            const category_code = input.id.split('_')[2];  // '1'이면 에어컨, '2'면 세탁기

            if (checkbox.checked) {
                if (category_code === '1') {
                    aircon += value;
                } else if (category_code === '2') {
                    washingmachine += value;
                }
            }
        });

        airconPrice.textContent = `에어컨 합계: ${aircon.toLocaleString()}원`;
        washingmachinePrice.textContent = `세탁기 합계: ${washingmachine.toLocaleString()}원`;
        apPrice.textContent = `총 합계: ${(aircon + washingmachine).toLocaleString()}원`;
        final();
        
    }

    apItems.forEach(item => {
        const checkbox = document.getElementById(item.checkboxId);
        const input = document.getElementById(item.inputId);

        input.addEventListener('input', updateApPrices);

        checkbox.addEventListener('change', function () {
            input.disabled = !this.checked;
            if (!this.checked) {
                input.value = '';
            }
            updateApPrices();
        });
    });

    //가격_할인
    const discountDiv1 = document.getElementById('discount1');
    const discountDiv2 = document.getElementById('discount2');
    const discountInput = document.getElementById('discountInput');

    //금액 계산
    const totalPriceResultFinal = document.getElementById('totalPriceResultFinal');
    const beforeDiscount = document.getElementById('beforeDiscount');
    function final() {
        //가격_정수형태
        const cleaningInt = parseInt(cleaningPriceDiv.textContent.replace(/[^0-9]/g, '')) || 0;
        const groutInt = parseInt(groutPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const keraInt = parseInt(keraPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const newhouseInt = parseInt(newhousePrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const paintInt = parseInt(paintPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const floorInt = parseInt(floorCoatingPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const coatingInt = parseInt(coatingPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const applianceInt = parseInt(apPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const beforDiscoutPrice = cleaningInt + groutInt + keraInt + newhouseInt + paintInt + floorInt + coatingInt + applianceInt;
        // 기본 금액 계산
        let totalPrice = cleaningInt + groutInt + keraInt + newhouseInt + paintInt + floorInt + coatingInt + applianceInt;
        //할인 금액
        const discountContainer = document.querySelector('.discountContainer');
        let discount1Amount = 0;
        let discount2Amount = 0;
        //줄눈패키지
        // let packageGR1_discountAmout = 0;
        let packageGR2_discountAmout = 0;
        let packageGR3_discountAmout = 0;
        let packageGR

        //100만원당 1% 할인 (최대 10%)
        if (totalPrice >= 1000000) {
            const millionUnit = Math.floor(totalPrice / 1000000);
            const discountRate = Math.min(millionUnit, 10) * 0.01;
            discount1Amount = Math.floor(beforDiscoutPrice * discountRate);
            discountDiv1.textContent = `할인 1번_골라담아 다다익선: -${discount1Amount.toLocaleString()}원`;
        }
        //청소 + 새집증후군 선택 시 평당 1,000원 할인
        if (checkCleaning.checked && checkNewhouse.checked) {
            const pyeong = getPyeongValue();
            discount2Amount = Math.floor(pyeong) * 1000;
            discountDiv2.textContent = `할인 2번_청소와 함께라면: -${discount2Amount.toLocaleString()}원`;
        }

        // 줄눈 패키지 할인
        // 줄눈 패키지 2: 스탠다드
        const gr_1_2 = document.getElementById('gr_1_2');
        const gr_2_3 = document.getElementById('gr_2_3');
        const gr_2_2 = document.getElementById('gr_2_2');
        // const packageGR1 = document.getElementById('packageGR1');
        const packageGR2 = document.getElementById('packageGR2');
        const packageGR3 = document.getElementById('packageGR3');
        
        if (gr_1_2.checked && gr_2_3.checked) {
            packageGR2_discountAmout = 70000; // 줄눈 패키지 할인 금액
            packageGR2.textContent = `줄눈 패키지 할인 스탠다드: -${packageGR2_discountAmout.toLocaleString()}원`;
        }

        if (gr_1_2.checked && gr_2_3.checked && gr_2_2.checked) {
            packageGR3_discountAmout = 240000; // 줄눈 패키지 할인 금액
            packageGR3.textContent = `줄눈 패키지 할인 스탠다드: -${packageGR3_discountAmout.toLocaleString()}원`;
        }


        // 4. 표시
        totalPrice = totalPrice - discount1Amount - discount2Amount - packageGR2_discountAmout - packageGR3_discountAmout;
        beforeDiscount.textContent = `할인 전 금액: ${beforDiscoutPrice.toLocaleString()}원`;
        totalPriceResultFinal.textContent = `최종 합계: ${totalPrice.toLocaleString()}원`;

    }

});
