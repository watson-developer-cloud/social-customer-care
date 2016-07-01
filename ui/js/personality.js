/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).ready(function() {
  var $loading = $('.profile-loading');
  var $account = $('.personality-insights--group_account');
  var $profile = $('.js-personality-characteristics');
  var $panel  = $('.personality-insights-container');

  var closeProfile = function() {
    $panel.removeClass('show');
    $('.tweet').removeClass('selected');
  }

  // Click on profile close
  $(document).on('click', '.personality-insights-container--cancel-icon', closeProfile);

  $(document).on('click', '.tweets--row', function () {
    if ($(this).find('.tweet').hasClass('selected')) {
      closeProfile();
      return;
    }
    $(this).find('.tweet').addClass('selected');
    showProfile($(this).data());
  });

  var showProfile = function(account) {
    $account.html(_.template(profileTemplate.innerHTML, account));
    $loading.show();

    $.get('/api/profile', { username: account.username })
    .done(function(response) {
      $profile.html(
        _.template(profileTraitTemplate.innerHTML, {
          traits: [response.big5, response.needs, response. values]
        })
      );
      $loading.hide();
    })
    .fail(function(error) {
      $loading.hide();
      console.log(error);
      $profile.html(error);
    });

    $panel.addClass('show');
  }
});
