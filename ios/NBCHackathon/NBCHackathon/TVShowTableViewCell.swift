//
//  TVShowTableViewCell.swift
//  NBCHackathon
//
//  Created by Lucas Farah on 3/5/16.
//  Copyright © 2016 Lucas Farah. All rights reserved.
//

import UIKit
import MGSwipeTableCell
class TVShowTableViewCell: MGSwipeTableCell {

  @IBAction func butAdd(sender: AnyObject) {
  }
  @IBOutlet weak var lblatch: UILabel!
  @IBOutlet weak var lblTitleName: UILabel!
  @IBOutlet weak var lblStar: UIImageView!
  @IBOutlet weak var imgvPoster: UIImageView!
  @IBOutlet weak var lblMatch: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
