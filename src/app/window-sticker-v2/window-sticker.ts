import { Injectable } from '@angular/core'
import { ApiService } from '../api.service'
import * as _ from 'lodash';
import { EpiDecodeData, DealerApiResponse } from '../api'
import { Observable, Subscriber } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})

export class WindowSticker {

  constructor(private apiService: ApiService) { }

  process(vin: string, apiKey: string, domain: string) {

    let dealerData: DealerApiResponse;
    let epiDecodeData: EpiDecodeData;
    let processObservable = new Observable(subscriber => {

      this.apiService.getEpiDecodeData(vin, { api_key: apiKey }).subscribe(
        {
          next: (value) => {
            value["vINDataSources"].map(resp => {
              if (resp["dataSourceName"] == "VINOptions") {
                epiDecodeData = resp["vehicleInfo"][0]
              }
            })
          },
          error: (err) => {
            console.log(err.message)
          },
          complete: () => {
            this.apiService.getDealerData({ api_key: apiKey, inventory_url: domain }).subscribe(
              {
                next: (response) => {
                  dealerData = response
                },
                error: (err) => {
                  console.log(err.message)
                },
                complete: () => {
                  let calculated = this.calculate(epiDecodeData)
                  subscriber.next(calculated)
                  subscriber.complete()
                }
              });
          }
        });
    });
    return processObservable
  }

  private calculate(epiDecodeData: EpiDecodeData) {

    let base_color = ["Silver", "Gray", "Red", "White", "Black", "Green", "Beige", "Blue", "Brown", "Gold", "Orange", "Purple", "Yellow", "Pink"]
    let respArr = []
    let featuresArr = []
    let equipmentArr = []
    let optionsArr = []
    let installedOptionsArr = []
    let totalOptionsMsrp = 0;
    let paintArr = []
    let dealer_name: any;
    let street: any;
    let state_zip: string;
    let phoneNo: any;
    let photo: any;
    let year: any;
    let make: any;
    let model: any;
    let trim: any;
    let manufacture_code: any;
    let transmission: any;
    let drivetrain: any;
    let body_type: any;
    let doors: any;
    let msrp: any;
    let ext_color: any;
    let ext_color_code: any;
    let finalColorArr = []
    let features: any;
    let equipment = []
    let final_equipemnt = []
    let respFlag = false;
    let hwy_mpg: any;
    let cty_mpg: any;
    let destination_charges: 0;
    let powertrain_miles = 0;
    let powertrain_years = 0;
    let rsa_miles = 0;
    let rsa_years = 0;
    let anticoro_miles = 0;
    let anticoro_years = 0;
    let bump_miles = 0;
    let bump_years = 0;
    let side_impact = 'NA';
    let overlap_front = 'NA';
    let roof_strength = 'NA';
    let rear_crash = 'NA';
    let overall_crash = 'NA';
    let cmb_mpg: any;

    let response = {}

    respArr.push(epiDecodeData)

    respArr.map(respData => {
      respData["installedOptionsDetails"].map(options => {
        optionsArr.push(options)
      })
    })
    respArr.map(respData => {
      respData["installedEquipment"].map(options => {
        equipmentArr.push(options)
      })
    })
    respArr.map(respData => {
      respData["installedEquipment"].map(options => {
        equipmentArr.push(options)
      })
    })
    respArr.map(respData => {
      respData["availablePaint"].map(paints => {
        paintArr.push(paints)
      })
    })
    respArr.map(respData => {
      respData["features"].map(features => {
        featuresArr.push(features)
      })
    })
    year = respArr[0]["modelYear"]
    make = respArr[0]["makeName"]
    model = respArr[0]["modelName"]
    trim = respArr[0]["trimName"]
    manufacture_code = respArr[0]["manufacturerCode"]
    transmission = respArr[0]["transmissionType"]
    drivetrain = respArr[0]["drivenWheels"]
    body_type = respArr[0]["bodyStyleName"]
    doors = respArr[0]["numberOfDoors"]
    msrp = respArr[0]["mSRP"]
    ext_color = respArr[0]["paint"] != null ? respArr[0]["paint"]["name"] : 'NA'
    ext_color_code = respArr[0]["paint"] != null ? respArr[0]["paint"]["code"] : 'NA'
    
    let total_msrp = 0
    optionsArr.map(options => {
      var optArr = []
      var msrp: any;
      options.optionPackageEquipment.map(options => {
        optArr.push(` ${options.category} - ${options.item} - ${options.value}`)
        optArr = optArr.filter(word =>
          word.includes("MSRP") != true);
        if (options.item === "MSRP") {
          msrp = options.value.replace('-', '')
        }
      })
      total_msrp = +total_msrp + +msrp
      installedOptionsArr[`${options.name} - ${options.optionCode}`] = { 'msrp': msrp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 'opt': optArr.join(",") }
      totalOptionsMsrp = total_msrp
      respFlag = true
    })

    paintArr.map(color => {
      base_color.map(baseColor => {
        if (color.name.includes(baseColor)) {
          let baseCol = { 'background-color': baseColor.toLocaleLowerCase() };
          finalColorArr.push({ baseColor: baseCol, 'colorName': color.name, 'colorCode': color.code });
        }
      })
    })

    features = _.mapValues(_.groupBy(_.uniqWith(featuresArr, _.isEqual), 'category'), clist => clist.map(feature => _.omit(feature, 'category')));

    equipment = _.mapValues(_.groupBy(_.uniqWith(equipmentArr, _.isEqual), 'category'), clist => clist.map(feature => _.omit(feature, 'category')));
    let keys = Object.keys(equipment);
    keys.map(key => {
      let obj = {};
      let data = equipment[`${key}`];
      const item = _.mapValues(_.groupBy(_.uniqWith(data, _.isEqual), 'item'), clist => clist.map(feature => _.omit(feature, 'item')));
      obj[`${key}`] = item;
      let objArray = [];
      let itemkeys = Object.keys(obj[`${key}`]);
      itemkeys.map(itemkey => {
        let attributedata = obj[`${key}`][`${itemkey}`];
        let attribute = _.mapValues(_.groupBy(_.uniqWith(attributedata, _.isEqual), 'attribute'), clist => clist.map(feature => _.omit(feature, 'attribute')));
        let oobj = {};
        oobj[`${itemkey}`] = attribute;
        objArray.push(oobj);
      })
      obj[`${key}`] = objArray;
      final_equipemnt.push(obj)
    })

    final_equipemnt.map(euip => {
      if (euip["Price & Cost"]) {
        euip["Price & Cost"].filter(charges => {
          if (charges.hasOwnProperty("Delivery Charges")) {
            destination_charges = charges["Delivery Charges"]["Amount USD"].pop().value
          }
        })
      }
    })

    final_equipemnt.map(equip => {
      if (equip["Warranty"]) {
        equip["Warranty"].filter(warranty => {
          if (warranty.hasOwnProperty("Warranty powertrain - Total")) {
            powertrain_miles = warranty["Warranty powertrain - Total"]["distance (miles)"].pop().value
            powertrain_years = warranty["Warranty powertrain - Total"]["duration (months)"].pop().value / 12
          } else if (warranty.hasOwnProperty("Warranty roadside assistance")) {
            rsa_miles = warranty["Warranty roadside assistance"]["distance (miles)"].pop().value
            rsa_years = warranty["Warranty roadside assistance"]["duration (months)"].pop().value / 12
          } else if (warranty.hasOwnProperty("Warranty anti-corrosion")) {
            anticoro_miles = warranty["Warranty anti-corrosion"]["distance (miles)"].pop().value
            anticoro_years = warranty["Warranty anti-corrosion"]["duration (months)"].pop().value / 12
          } else if (warranty.hasOwnProperty("Warranty whole vehicle - Total")) {
            bump_miles = warranty["Warranty whole vehicle - Total"]["distance (miles)"].pop().value
            bump_years = warranty["Warranty whole vehicle - Total"]["duration (months)"].pop().value / 12
          }
        })
      }
    })

    final_equipemnt.map(euip => {
      if (euip["Fuel Economy"]) {
        let tmp = euip["Fuel Economy"][0]
        if (tmp.hasOwnProperty("Fuel economy")) {
          cmb_mpg = tmp["Fuel economy"]["combined (mpg)"].pop().value
          hwy_mpg = tmp["Fuel economy"]["country/highway (mpg)"].pop().value
          cty_mpg = tmp["Fuel economy"]["urban (mpg)"].pop().value
        } else {
          cmb_mpg = 'NA'
          hwy_mpg = 'NA'
          cty_mpg = 'NA'
        }
      }
    })
    
    final_equipemnt.map(euip => {
      if (euip["Safety & Driver Assist"]) {
        euip["Safety & Driver Assist"].filter(charges => {
          if (charges.hasOwnProperty("Crash test results")) {
            if (charges["Crash test results"].hasOwnProperty("side impact")) {
              side_impact = charges["Crash test results"]["side impact"].pop().value
            }
            else {
              side_impact = 'NA'
            }
          }
        })
      }
    })

    final_equipemnt.map(euip => {
      if (euip["Safety & Driver Assist"]) {
        euip["Safety & Driver Assist"].filter(charges => {
          if (charges.hasOwnProperty("Crash test results")) {
            if (charges["Crash test results"].hasOwnProperty("small overlap front test")) {
              overlap_front = charges["Crash test results"]["small overlap front test"].pop().value
            } else {
              overlap_front = 'NA'
            }
          }
        })
      }
    })

    final_equipemnt.map(euip => {
      if (euip["Safety & Driver Assist"]) {
        euip["Safety & Driver Assist"].filter(charges => {
          if (charges.hasOwnProperty("Crash test results")) {
            if (charges["Crash test results"].hasOwnProperty("roof strength test")) {
              roof_strength = charges["Crash test results"]["roof strength test"].pop().value
            } else {
              roof_strength = 'NA'
            }

          }
        })
      }
    })

    final_equipemnt.map(euip => {
      if (euip["Safety & Driver Assist"]) {
        euip["Safety & Driver Assist"].filter(charges => {
          if (charges.hasOwnProperty("Crash test results")) {
            if (charges["Crash test results"].hasOwnProperty("rear crash protect/head restraint rating")) {
              rear_crash = charges["Crash test results"]["rear crash protect/head restraint rating"].pop().value
            } else {
              rear_crash = 'NA'
            }

          }
        })
      }
    })

    final_equipemnt.map(euip => {
      if (euip["Safety & Driver Assist"]) {
        euip["Safety & Driver Assist"].filter(charges => {
          if (charges.hasOwnProperty("Crash test results")) {
            overall_crash = charges["Crash test results"]["Crash test results"].pop().value
          }
        })
      }
    })

    response['dealer_name'] = dealer_name
    response['street'] = street
    response['state_zip'] = state_zip
    response['phoneNo'] = phoneNo
    response['year'] = year
    response['make'] = make
    response['model'] = model
    response['doors'] = doors
    response['body_type'] = body_type
    response['installedOptionsArr'] = installedOptionsArr
    response['totalOptionsMsrp'] = totalOptionsMsrp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['msrp'] = msrp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['transmission'] = transmission
    response['trim'] = trim
    response['ext_color'] = ext_color
    response['ext_color_code'] = ext_color_code
    response['manufacture_code'] = manufacture_code
    response['hwy_mpg'] = hwy_mpg
    response['cty_mpg'] = cty_mpg
    response['cmb_mpg'] = cmb_mpg
    response['finalColorArr'] = finalColorArr
    response['features'] = features
    response['final_equipemnt'] = final_equipemnt
    response['destination_charges'] = destination_charges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['powertrain_miles'] = powertrain_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['powertrain_years'] = powertrain_years
    response['rsa_miles'] = rsa_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['rsa_years'] = rsa_years
    response['anticoro_miles'] = anticoro_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['anticoro_years'] = anticoro_years
    response['bump_miles'] = bump_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    response['bump_years'] = bump_years
    response['overall_crash'] = overall_crash
    response['rear_crash'] = rear_crash
    response['roof_strength'] = roof_strength
    response['overlap_front'] = overlap_front
    response['side_impact'] = side_impact
    return response
  }

}