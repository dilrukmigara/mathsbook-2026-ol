import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {normalizePhone,validateRegistration,validateUpdate,csvCell} from '../src/lib/semina/validation.mjs';
const valid=()=>({studentName:'Test Student',whatsapp:'072 123 4567',examYear:'2026',consent:true,requestId:randomUUID()});
test('normalizes Sri Lankan phone formats',()=>{for(const input of ['0721234567','+94 72 123 4567','94721234567'])assert.equal(normalizePhone(input),'94721234567');for(const input of ['123','abc0721234567','+940721234567',null])assert.throws(()=>normalizePhone(input));});
test('requires consent, year, name, request ID; rejects spam',()=>{assert.equal(validateRegistration(valid()).whatsapp_number,'94721234567');for(const patch of [{consent:false},{examYear:2020},{studentName:''},{requestId:'bad'},{website:'https://spam.example'}])assert.throws(()=>validateRegistration({...valid(),...patch}));});
test('never accepts client-controlled admin fields',()=>{const value=validateRegistration({...valid(),payment_status:'verified',id:'attacker'});assert.equal(value.payment_status,undefined);assert.equal(value.id,undefined);assert.deepEqual(validateUpdate({id:randomUUID(),group_status:'joined',student_name:'override'}),{group_status:'joined'});assert.throws(()=>validateUpdate({id:randomUUID(),group_status:'yes'}));});
test('CSV protects formulas, quotes and line breaks',()=>{assert.equal(csvCell('=SUM(A1)'),`"'=SUM(A1)"`);assert.equal(csvCell('x"y'), '"x""y"');assert.equal(csvCell('මිගාර'),'"මිගාර"');});
