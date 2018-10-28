(function () {
    angular.module('app').directive('timeslotPicker', function () {
        function link($scope, $rootScope, element, attrs, modelCtrl) {
            $scope.oneUnit = 56;
            $scope.a = 0;
            $scope.b = 0;
            $scope.x = 0;
            $scope.y = 0;
            $scope.m = 0;
            $scope.n = 0;

            $scope.roundTime = function (number, increment, offset) {
                return Math.ceil((number - offset) / increment) * increment + offset;
            }

            $scope.AddHours = function (from, to) {
                var $container = $("#time_value_container");
                $container.empty();
                for (var x = from; x <= to; x++) {
                    var $time_value = $("<td></td>");
                    var $center = $("<center></center>")
                    .css("font-family", "Calibri, sans-serif");
                    var txt = x >= 12 ? "<sup>PM</sup>" : "<sup>AM</sup>";
                    $center.html((x > 12 ? (x - 12) : x) + "&nbsp;");
                    var $sup = $("<sup></sup>");
                    $sup.css("font-weight", "normal");
                    $sup.css("vertical-align", "middle");
                    $sup.css("font-size", "x-small");
                    $sup.html(txt);
                    $sup.appendTo($center);
                    $center.css("font-weight", "bold")
                        .css("font-size", "15px")
                        .css("color", "#7D7D7D")
                        .css("padding-left", "10px");
                    $time_value.append($center);
                    $time_value.appendTo($container);
                }
                $("#resize_container_td").attr("colspan", to - from + 1);
            }

            $scope.ConvertTimeToPixels = function (fromTime, time) {
                var fromArrTime = fromTime.split(":");

                var arrTime = time.split(":");
                var hours = parseInt(arrTime[0]) - parseInt(fromArrTime[0]);
                var minutes = parseInt(arrTime[1]);
                //60min = 56pixels
                var minuteTick = (minutes * $scope.oneUnit) / 60;
                var pixels = (hours * $scope.oneUnit) + minuteTick;
                return pixels;
            }

            $scope.ConvertUnitsToTime = function (units) {
                var fromText = $($("#time_value_container td:first").find("center")).text();
                var fromHours = fromText.indexOf("PM") >= 0 ? (parseInt(fromText) + 12) : parseInt(fromText);
                if ((units + "").indexOf(".") >= 0) {
                    var arrUnits = (units + "").split(".");

                    var hours = parseInt(arrUnits[0]) + fromHours;
                    var minutes = "00";
                    switch (arrUnits[1]) {
                        case "25":
                            minutes = "15";
                            break;
                        case "5":
                            minutes = "30";
                            break;
                        case "75":
                            minutes = "45";
                            break;
                    }
                    return (hours > 12 ? (hours - 12) : hours) + ":" + minutes + " " + (hours >= 12 ? "PM" : "AM");
                } else {
                    var hours = parseInt(units) + fromHours;
                    return (hours > 12 ? (hours - 12) : hours) + ":" + "00" + " " + (hours >= 12 ? "PM" : "AM");
                }
            }

            //12:35, 1:12
            $scope.AddAllowedSlot = function (from, to) {
                var startingHours = $($("#time_value_container td:first").find("center")).text();
                var $container = $(".resize_container");
                var $allowedSlot = $("<div></div>");
                $allowedSlot.addClass("allowedSlot");
                var leftPixels = $scope.ConvertTimeToPixels(parseInt(startingHours) + ":00", from);
                var fromPixels = $scope.ConvertTimeToPixels(from, from);
                var toPixels = $scope.ConvertTimeToPixels(from, to);
                $allowedSlot.css("left", leftPixels + "px");
                $allowedSlot.css("width", (toPixels - fromPixels) + "px");
                $allowedSlot.appendTo($container);
            }

            $scope.CheckValidity = function (x, first) {
                var currentUnit = $(".resize-drag").outerWidth();
                var width = ($scope.roundTime(currentUnit, ($scope.oneUnit / 4), 0) / $scope.oneUnit) - 0.25;
                console.log("width:" + width);

                var fromLeft = ($scope.roundTime(x, ($scope.oneUnit / 4), 0) / $scope.oneUnit) - 0.25;
                console.log("From left:" + fromLeft);

                var validfromLeft = ($scope.roundTime(parseInt($(".allowedSlot").css("left").replace("px", "")), ($scope.oneUnit / 4), 0) / $scope.oneUnit) - 0.25;
                var validWidth = $scope.roundTime($(".allowedSlot").outerWidth(), ($scope.oneUnit / 4), 0) / $scope.oneUnit;
                console.log("valid width: " + validWidth);
                console.log("valid left: " + validfromLeft);

                if (width <= validWidth && fromLeft >= validfromLeft && (fromLeft + width) <= (validfromLeft + validWidth - 0.25)) {
                    $(".resize-drag").addClass("resizeValid");
                    $(".resize-drag").removeClass("resizeInvalid");
                } else {
                    $(".resize-drag").addClass("resizeInvalid");
                    $(".resize-drag").removeClass("resizeValid");
                }

                var fromSelected = ($scope.ConvertUnitsToTime(fromLeft + 0.25));
                var toSelected = ($scope.ConvertUnitsToTime(fromLeft + width + 0.25));
                $("#time_selected").html(fromSelected + " to " + toSelected);
                //console.log(fromSelected + " to " + toSelected);
                if ($(".resize-drag").outerWidth() <= 143) {
                    $("#time_selected").hide();
                } else {
                    $("#time_selected").show();
                }

                $scope.OnChange(fromSelected, toSelected, first);
            }

            $scope.ShowTimeRangePicker = function (elm) {
                var div = document.querySelector('#time_strip_table');
                var inp = document.querySelector('#action_qty');
                var rect = inp.getClientRects();
                div.style.display = 'block';
                div.style.left = rect[0].left + 'px';
                div.style.top = rect[0].bottom + 'px';

                $("#time_strip_table").fadeIn();
            }

            $scope.OnChange = function (from, to, first) {
                $("#action_qty").val(from + " to " + to);
                //$scope.$emit('onTimeSlotChanged', { from: from, to: to, isValid: $(".resize-drag").hasClass("resizeValid") });
                if (!first)
                    $scope.onTimeslotChanged({ from: from, to: to, isValid: $(".resize-drag").hasClass("resizeValid") });
            }

            $scope.HideTimeRangePicker = function (elm) {
                $("#time_strip_table").fadeOut().promise().done(function () {
                    $("#time_strip_table").css("transform", "");
                });
            }

            //var eId = angular.element(element).attr("id");
            //alert(scope.startingTime.from);
            $scope.AddHours($scope.startingTime.from, $scope.startingTime.to);
            for (var x = 0; x < $scope.timeSlots.length; x++) {
                var allowedSlot = $scope.timeSlots[x];
                $scope.AddAllowedSlot(allowedSlot.from, allowedSlot.to);
            }

            var a, b;

            interact('.resize-drag')
            .draggable({
                snap: {
                    targets: [
                        interact.createSnapGrid({ x: 15, y: 1 })
                    ],
                    range: Infinity,
                    relativePoints: [{ x: 0, y: 0 }]
                },
                restrict: {
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                },
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: false, top: false },
                snap: {
                    targets: [
                        interact.createSnapGrid({ x: 15, y: 1 })
                    ],
                    relativePoints: [{ x: 0, y: 0 }]
                },
                snapSize: {
                    targets: [
                        { width: $scope.oneUnit, height: 40, range: 1 },
                    ]
                },

                // keep the edges inside the parent
                restrictEdges: {
                    outer: 'parent',
                    endOnly: true,
                },

                // minimum size
                restrictSize: {
                    min: { width: 25, height: 40 },
                },

                inertia: true,
            })
            .on('resizemove', function (event) {
                console.log("in resizemove");
                var target = event.target;
                $scope.x = (parseFloat(target.getAttribute('data-x')) || 0);
                $scope.y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                $scope.x += event.deltaRect.left;
                $scope.y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + $scope.x + 'px,' + $scope.y + 'px)';

                target.setAttribute('data-x', $scope.x);
                target.setAttribute('data-y', $scope.y);
                //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

                $scope.CheckValidity($scope.x);
            })
            .on('dragmove', function (event) {
                var target = event.target;
                // keep the dragged position in the data-x/data-y attributes
                $scope.a = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                $scope.b = (parseFloat(target.getAttribute('data-y')) || 0);// + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + $scope.a + 'px, ' + $scope.b + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', $scope.a);
                target.setAttribute('data-y', $scope.b);

                $scope.CheckValidity($scope.a);
            });

            $scope.dragMoveListener = function (event) {
                var target = event.target;
                // keep the dragged position in the data-x/data-y attributes
                $scope.m = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                $scope.n = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                  'translate(' + $scope.m + 'px, ' + $scope.n + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', $scope.m);
                target.setAttribute('data-y', $scope.n);
            }

            // target elements with the "draggable" class
            interact('#time_strip_table')
              .draggable({
                  autoScroll: true,
                  onmove: $scope.dragMoveListener,
              });

            // this is used later in the resizing and gesture demos
            window.dragMoveListener = $scope.dragMoveListener;

            $(".resize-drag").on("dblclick", function () {
                $scope.HideTimeRangePicker(this);
            });

            $scope.CheckValidity(0, true);
            //var logText = 'the element "' + eName + '" ';
            //angular.element(element).on("click mousedown mouseup focus blur keydown change", function (e) {
            //    console.log(new Date().toLocaleTimeString()+': "' + e.type + '"' + " event occurred for " + logText);
            //});
        }

        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'App/Main/Directives/timeslotPicker.html',
            transclude: true,
            replace: true,
            scope: {
                startingTime: '=',
                timeSlots: '=',
                onTimeslotChanged: '='
            },
            id: '='
        };
        return directive;
    });
})();