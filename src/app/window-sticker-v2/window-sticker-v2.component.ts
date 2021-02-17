import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowSticker } from './window-sticker'

@Component({
  selector: 'window-sticker',
  templateUrl: './window-sticker-v2.component.html',
  styleUrls: ['./window-sticker-v2.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class WindowStickerV2Component implements OnInit {
  // @ViewChild('barcode') barcodeRef: ElementRef;
  @Input() vin: any;
  @Input('api_key') apiKey: any;
  @Input('title') title: any;
  @Input('styles') style: string;
  @Input('domain') domain: string;
  styleCustom = {};
  rspFlag = false;
  year: any;
  make: any;
  model: any;
  trim: any;
  doors: any;
  dealer_name: any;
  street: any;
  state_zip: any;
  phoneNo: any;
  body_type: any;
  transmission: any;
  cty_mpg: any;
  hwy_mpg: any;
  cmb_mpg: any;
  features = []
  finalColorArr = []
  final_equipemnt = []
  installedOptionsArr = []
  manufacture_code: any;
  msrp: any;
  totalOptionsMsrp: any;
  ext_color: any;
  ext_color_code: any;
  destination_charges: any;
  powertrain_miles: any;
  powertrain_years: any;
  rsa_miles: any;
  rsa_years: any;
  anticoro_miles: any;
  anticoro_years: any;
  bump_miles: any;
  bump_years: any;
  side_impact: any;
  overlap_front: any;
  roof_strength: any;
  rear_crash: any;
  overall_crash: any;
  constructor(private vdp: WindowSticker, private route: ActivatedRoute) { }

  ngOnInit() {

    if (this.style) {
      this.styleCustom = JSON.parse(this.style)
    }
    this.route.queryParamMap.subscribe(resp => {
      this.vin = resp["params"]["vin"]
      this.domain = resp["params"]["domain"]
      
      if (this.vin && this.domain) {
        this.vdp.process(this.vin, this.apiKey, this.domain).subscribe((response) => {
          this.year = response["year"]
          this.make = response["make"]
          this.model = response["model"]
          this.trim = response["trim"]
          this.doors = response["doors"]
          this.dealer_name = response["dealer_name"]
          this.street = response["street"]
          this.state_zip = response["state_zip"]
          this.phoneNo = response["phoneNo"]
          this.body_type = response["body_type"]
          this.transmission = response["transmission"]
          this.cty_mpg = response["cty_mpg"]
          this.hwy_mpg = response["hwy_mpg"]
          this.cmb_mpg = response["cmb_mpg"]
          this.features = response["features"]
          this.finalColorArr = response["finalColorArr"]
          this.final_equipemnt = response["final_equipemnt"]
          this.installedOptionsArr = response["installedOptionsArr"]
          this.manufacture_code = response["manufacture_code"]
          this.msrp = response["msrp"]
          this.totalOptionsMsrp = response["totalOptionsMsrp"]
          this.ext_color = response["ext_color"]
          this.ext_color_code = response["ext_color_code"]
          this.destination_charges = response["destination_charges"]
          this.powertrain_miles = response['powertrain_miles']
          this.powertrain_years = response['powertrain_years']
          this.rsa_miles = response['rsa_miles']
          this.rsa_years = response['rsa_years']
          this.anticoro_miles = response['anticoro_miles']
          this.anticoro_years = response['anticoro_years']
          this.bump_miles = response['bump_miles']
          this.bump_years = response['bump_years']
          this.side_impact = response['side_impact']
          this.overlap_front = response['overlap_front']
          this.roof_strength = response['roof_strength']
          this.rear_crash = response['rear_crash']
          this.overall_crash = response['overall_crash']
          this.rspFlag = true
        })
      }
    })
  }
}