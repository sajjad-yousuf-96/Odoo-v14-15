from odoo import http, _
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager
from odoo.exceptions import AccessError, MissingError
from collections import OrderedDict
from odoo.http import request
import base64
import random
import json
# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import base64
import copy
import datetime
import functools
import hashlib
import io
import itertools
import json
import logging
import operator
import os
import re
import sys
import tempfile
import unicodedata
from collections import OrderedDict, defaultdict

import babel.messages.pofile
import werkzeug
import werkzeug.exceptions
import werkzeug.utils
import werkzeug.wrappers
import werkzeug.wsgi
from lxml import etree, html
from markupsafe import Markup
from werkzeug.urls import url_encode, url_decode, iri_to_uri

import odoo
import odoo.modules.registry
from odoo.api import call_kw
from odoo.addons.base.models.ir_qweb import render as qweb_render
from odoo.modules import get_resource_path, module
from odoo.tools import html_escape, pycompat, ustr, apply_inheritance_specs, lazy_property, float_repr, osutil
from odoo.tools.mimetypes import guess_mimetype
from odoo.tools.translate import _
from odoo.tools.misc import str2bool, xlsxwriter, file_open, file_path
from odoo.tools.safe_eval import safe_eval, time
from odoo import http
from odoo.http import content_disposition, dispatch_rpc, request, serialize_exception as _serialize_exception
from odoo.exceptions import AccessError, UserError, AccessDenied
from odoo.models import check_method_name
from odoo.service import db, security
import odoo
from odoo import api, fields, models, tools
# from odoo.osv import expression
# from odoo.exceptions import UserError, ValidationError
from datetime import date
from odoo import http
from io import BytesIO
# from captcha.image import ImageCaptcha
from odoo.http import request
from odoo.addons.web.controllers.main import Home, ensure_db, _get_login_redirect_url
from odoo.tools.translate import _
from random import randint

SIGN_UP_REQUEST_PARAMS = {'db', 'login', 'debug', 'token', 'message', 'error', 'scope', 'mode',
                          'redirect', 'redirect_hostname', 'email', 'name', 'partner_id',
                          'password', 'confirm_password', 'city', 'country_id', 'lang'}


class Authentication(http.Controller):

    def _get_login_redirect_url(uid, redirect=None):
        """ Decide if user requires a specific post-login redirect, e.g. for 2FA, or if they are
        fully logged and can proceed to the requested URL
        """
        if request.session.uid:  # fully logged
            return redirect or '/web'

        # partial session (MFA)
        url = request.env(user=uid)['res.users'].browse(uid)._mfa_url()
        if not redirect:
            return url

        parsed = werkzeug.urls.url_parse(url)
        qs = parsed.decode_query()
        qs['redirect'] = redirect
        return parsed.replace(query=werkzeug.urls.url_encode(qs)).to_url()

    def login_redirect(self, uid, redirect=None):
        return _get_login_redirect_url(uid, redirect)

    @http.route('/iba/login', website=True, auth='public')
    def login_auth(self, **kwargs):
        # ensure_db()
        request.params['login_success'] = False
        return request.render('IBA_LOGIN_SYSTEM.login_page', {})

    @http.route('/test/path', type='http', methods=['POST'], auth="public", website=True, csrf=False)
    def test_path(self, redirect=None, **kw):
        print(kw['login'])
        # here in kw you can get the inputted value
        ensure_db()
        request.params['login_success'] = False
        if request.httprequest.method == 'GET' and redirect and request.session.uid:
            return request.redirect(redirect)

        if not request.uid:
            request.uid = odoo.SUPERUSER_ID

        values = {k: v for k, v in request.params.items() if k in SIGN_UP_REQUEST_PARAMS}
        try:
            values['databases'] = http.db_list()
        except odoo.exceptions.AccessDenied:
            values['databases'] = None

        if request.httprequest.method == 'POST':
            old_uid = request.uid
            try:
                uid = request.session.authenticate(request.session.db, request.params['login'],
                                                   request.params['password'])
                request.params['login_success'] = True
                return request.redirect(self._login_redirect(uid, redirect=redirect))
            except odoo.exceptions.AccessDenied as e:
                request.uid = old_uid
                if e.args == odoo.exceptions.AccessDenied().args:
                    values['error'] = _("Wrong login/password")
                else:
                    values['error'] = e.args[0]
        else:
            if 'error' in request.params and request.params.get('error') == 'access':
                values['error'] = _('Only employees can access this database. Please contact the administrator.')

        if 'login' not in values and request.session.get('auth_login'):
            values['login'] = request.session.get('auth_login')

        if not odoo.tools.config['list_db']:
            values['disable_database_manager'] = True

        response = request.render('web.login', values)
        response.headers['X-Frame-Options'] = 'DENY'
        return response